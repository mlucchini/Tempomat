import {CircleciRepoDto} from "model/dto/CircleciRepo.dto"
import {Node, Status, Source, VCS} from "model"
import {AppcenterRepoDto} from "model/dto/AppcenterRepo.dto"
import {AppcenterBranchDto} from "model/dto/AppcenterBranch.dto"
import {TravisRepoDto} from "model/dto/TravisRepos.dto"
import {TravisBranchesDto} from "model/dto/TravisBranches.dto"
import {
  BitriseBranchDto,
  BitriseRepoDto,
  BitriseStatus,
} from "model/dto/Bitrise.dto"
import {GithubWorkflowDto, GithubWorkflowRunInfo} from "model/dto/Github.dto"

export class DtoMapper {
  static mapGithubReposToNodes(repos: CircleciRepoDto[], key: string): Node[] {
    let nodes: Node[] = []

    for (let i = 0; i < repos.length; i++) {
      let repo = repos[i]
      let branches = Object.entries(repo.branches)
      for (let j = 0; j < branches.length; j++) {
        let [name, info] = branches[j]

        let node = new Node()

        let status = Status.passed
        let hasRuns = !!info.recent_builds?.length
        let isRunning = !!info.running_builds?.length
        let lastestDate

        let jobId: string = `-`

        if (hasRuns) {
          let latestBuild = info.recent_builds!.reduce((cur, b) =>
            b.build_num > cur.build_num ? b : cur,
          )

          if (latestBuild.outcome !== `success`) {
            status = Status.failed
          }

          jobId = latestBuild.build_num.toString()
          lastestDate = latestBuild.pushed_at
        }

        if (isRunning) {
          status = Status.running
          lastestDate = info.running_builds![0].pushed_at
        }

        let vcsLong = repo.vcs_url.includes(`github`) ? `github` : `bitbucket`
        let vcsShort = repo.vcs_url.includes(`github`) ? `gh` : `bb`
        let unscapedName = unescape(name)

        node.id = `${Source.circleci}-${repo.username}-${repo.reponame}-${name}`
        node.url = `https://circleci.com/${vcsShort}/${repo.username}/${repo.reponame}/tree/${name}`
        node.date = lastestDate
        node.source = Source.circleci
        node.label = `${repo.username}/${repo.reponame} [${unscapedName}] #${jobId}`
        node.status = status
        node.key = key
        node.buildUrl = `https://circleci.com/api/v1.1/project/${vcsLong}/${repo.username}/${repo.reponame}/tree/${name}?circle-token=${key}`

        nodes.push(node)
      }
    }

    return nodes
  }

  static mapAppcenterTuplesToNodes(
    repo: AppcenterRepoDto,
    branches: AppcenterBranchDto[],
    key: string,
  ): Node[] {
    return branches.map((branch) => {
      let node = new Node()
      let status = Status.pending

      if (branch.lastBuild?.status === `inProgress`) {
        status = Status.running
      }

      if (branch.lastBuild?.result === `succeeded`) {
        status = Status.passed
      }

      if (branch.lastBuild?.result === `failed`) {
        status = Status.failed
      }

      let jobId: string = branch.lastBuild
        ? ` #${branch.lastBuild.buildNumber}`
        : ``

      let urlFriendlyBranchName = branch.branch.name.replace(`/`, `%2F`)

      node.id = `${Source.appcenter}-${repo.owner.name}-${repo.name}-${branch.branch.name}`
      node.url = `https://appcenter.ms/users/${repo.owner.name}/apps/${repo.name}/build/branches/${urlFriendlyBranchName}`
      node.label = `${repo.owner.name}/${repo.name} [${branch.branch.name}]${jobId}`
      node.source = Source.appcenter
      node.status = status
      node.key = key
      node.buildUrl = `https://api.appcenter.ms/v0.1/apps/${repo.owner.name}/${repo.name}/branches/${urlFriendlyBranchName}/builds`
      return node
    })
  }

  static mapTravisTuplesToNodes(
    repo: TravisRepoDto,
    branches: TravisBranchesDto,
    key: string,
  ): Node[] {
    return branches.branches.map((branch) => {
      let node = new Node()
      let commit = branches.commits.find((c) => c.id === branch.commit_id)!

      let status = Status.pending
      if (branch.state === `errored`) {
        status = Status.failed
      }

      if (branch.state === `started`) {
        status = Status.running
      }

      if (branch.state === `passed`) {
        status = Status.passed
      }

      node.id = `${Source.travisci}-${repo.slug}-${commit.branch}`
      node.url = `https://travis-ci.com/github/${repo.slug}`
      node.label = `${repo.slug} [${commit.branch}]`
      node.source = Source.travisci
      node.status = status
      node.key = key
      node.date = branch.started_at

      return node
    })
  }

  static mapBitriseTuplesToNode(
    repo: BitriseRepoDto,
    branches: BitriseBranchDto[],
    key: string,
  ): Node[] {
    return branches.map((branch) => {
      let node = new Node()
      let status: Status
      switch (branch.status) {
        case BitriseStatus.successful:
          status = Status.passed
          break
        case BitriseStatus.abortedWithFailure:
          status = Status.failed
          break
        case BitriseStatus.abortedWithSuccess:
          status = Status.passed
          break
        case BitriseStatus.notFinished:
          status = Status.running
          break
        case BitriseStatus.failed:
          status = Status.failed
          break
        default:
          status = Status.pending
          break
      }

      node.id = `${Source.bitrise}-${repo.title}-${repo.branch}-${branch.build_number}`
      node.url = `https://app.bitrise.io/build/${branch.slug}`
      node.label = `${repo.repo_owner}/${repo.title} [${branch.branch}] #${branch.build_number}`
      node.source = Source.bitrise
      node.status = status
      node.key = key
      node.date = branch.finished_at
      node.buildUrl = `https://api.bitrise.io/v0.1/apps/${repo.slug}/builds`
      // Storing the API provided repository "title" to be used in further calls to the api
      node.extra = repo.title

      return node
    })
  }

  static mapGithubActionTupleToNode(
    slug: string,
    workflowDto: GithubWorkflowDto,
    latestRun: GithubWorkflowRunInfo,
    key: string,
  ): Node {
    let node = new Node()
    let status = Status.pending

    switch (latestRun.conclusion) {
      case `success`:
        status = Status.passed
        break

      case `failed`:
        status = Status.failed
        break

      case `in_progress`:
        status = Status.running
        break

      default:
        break
    }

    let pathComponent = `workflow%3A${workflowDto.name}`

    node.id = `${Source.github}-${slug}-${workflowDto.name}`
    node.url = `https://github.com/${slug}/actions?query=${pathComponent}`
    node.label = `${slug} [${workflowDto.name}] #${latestRun.run_number}`
    node.date = latestRun.created_at
    node.status = status
    node.jobId = `${latestRun.run_number}`
    node.source = Source.github
    node.vcs = VCS.github
    node.key = key
    return node
  }
}
