import {RootStore} from "Root.store"
import axios from "axios"
import {Node} from "model"
import {CircleciRepoDto} from "model/dto/CircleciRepo.dto"
import {DtoMapper} from "lib/DtoMapper"
import {AppcenterRepoDto} from "model/dto/AppcenterRepo.dto"
import {TravisReposDto} from "model/dto/TravisRepos.dto"
import {
  BitrisePaginated,
  BitriseRepoDto,
  BitriseBranchDto,
} from "model/dto/Bitrise.dto"
import {
  GithubWorkflowsDto,
  GithubWorkflowDto,
  GithubWorkflowInfoDto,
} from "model/dto/Github.dto"

interface AjaxCallParams {
  auth?: string
  method: `GET` | `POST` | `DELETE` | `PUT`
  url: string
  body?: any
  headers?: any
}

export class ApiStore {
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
  }

  //////////////////////////////////////////////////
  // Internal calls
  //////////////////////////////////////////////////

  private ajaxCall = async ({
    url,
    auth,
    method,
    body,
    headers = {},
  }: AjaxCallParams) => {
    try {
      let res = await axios({
        url,
        method,
        headers: {
          Authorization: auth,
          "Content-Type": `application/json`,
          ...headers,
        },
        data: body ? JSON.stringify(body) : undefined,
      })

      return res.data
    } catch (e) {
      let error = e.toJSON()
      console.warn(`Request failed`, url, error)
    }
  }

  private get = (props: {
    url: string
    auth?: string
    headers?: Record<string, string>
  }) => this.ajaxCall({method: `GET`, ...props})

  private post = (props: {
    url: string
    auth?: string
    body?: any
    headers?: Record<string, string>
  }) => this.ajaxCall({method: `POST`, ...props})

  private put = (props: {
    url: string
    auth?: string
    headers?: Record<string, string>
  }) => this.ajaxCall({method: `PUT`, ...props})

  //////////////////////////////////////////////////
  // Start of proper API
  //////////////////////////////////////////////////

  // public login = (organizationName: string, email: string, password: string) =>
  //   this.post({
  //     body: {organizationName, email, password},
  //     url: `/auth/login`,
  //   });

  // public createWorkflow = (token: string, name: string) =>
  //   this.post({
  //     body: {
  //       name,
  //       templates: [],
  //     },
  //     url: `/workflows`,
  //     auth: token,
  //   });

  // public fetchAllWorkflows = (token: string) =>
  //   this.get({
  //     url: `/workflows`,
  //     auth: token,
  //   });

  // public createTemplate = (
  //   token: string,
  //   workflowId: string,
  //   templateName: string,
  // ) =>
  //   this.post({
  //     url: `/workflows/${workflowId}/templates`,
  //     auth: token,
  //     body: {
  //       name: templateName,
  //     },
  //   });

  // public updateTemplate = (
  //   token: string,
  //   workflowId: string,
  //   templateId: string,
  //   template: Partial<TemplateModel>,
  // ) =>
  //   this.put({
  //     auth: token,
  //     body: template,
  //     url: `/workflows/${workflowId}/templates/${templateId}`,
  //   });

  // public executeWorkflow = (auth: string, workflowId: string) =>
  //   this.post({
  //     auth,
  //     url: `/workflows/${workflowId}/trigger`,
  //   });

  // public fetchRun = (auth: string, workflowId: string, runId: string) =>
  //   this.get({
  //     auth,
  //     url: `/workflows/${workflowId}/runs/${runId}`,
  //   });

  // public fetchTemplateRunResponses = (
  //   auth: string,
  //   workflowId: string,
  //   runId: string,
  //   templateId: string,
  // ) =>
  //   this.get({
  //     auth,
  //     url: `/workflows/${workflowId}/runs/${runId}/${templateId}`,
  //   });

  // public fetchWorkflowRuns = (auth: string, workflowId: string) =>
  //   this.get({
  //     auth,
  //     url: `/workflows/${workflowId}/runs/`,
  //   });

  public async fetchCircleciNodes(token: string): Promise<Node[]> {
    //first fetch the repos
    let repos: CircleciRepoDto[] = await this.get({
      url: `https://circleci.com/api/v1.1/projects?circle-token=${token}`,
    })

    let nodes = DtoMapper.mapGithubReposToNodes(repos, token)

    return nodes
  }

  public async fetchAppcenterNodes(key: string): Promise<Node[]> {
    let repos: AppcenterRepoDto[] = await this.get({
      url: `https://api.appcenter.ms/v0.1/apps`,
      headers: {
        "X-API-Token": key,
      },
    })

    let branchPromises = repos.map((r) =>
      this.get({
        url: `https://api.appcenter.ms/v0.1/apps/${r.owner.name}/${r.name}/branches`,
        headers: {
          "X-API-Token": key,
        },
      }),
    )

    let resolvedBranches = await Promise.all(branchPromises)
    console.warn(`appcenter branches`, resolvedBranches)

    let nodes = resolvedBranches
      .map((branches, ii) =>
        DtoMapper.mapAppcenterTuplesToNodes(repos[ii], branches, key),
      )
      .flat()

    return nodes
  }

  public async fetchTravisciNodes(key: string): Promise<Node[]> {
    let reposDto: TravisReposDto = await this.get({
      url: `https://api.travis-ci.com/repos`,
      headers: {
        Accept: `application/vnd.travis-ci.2.1+json`,
        Authorization: `token ${key}`,
        "User-Agent": `Tempomat/2.0.0`,
      },
    })

    let branchPromises = reposDto.repos.map((r) =>
      this.get({
        url: `https://api.travis-ci.com/repos/${r.slug}/branches`,
        headers: {
          Accept: `application/vnd.travis-ci.2.1+json`,
          Authorization: `token ${key}`,
          "User-Agent": `Tempomat/2.0.0`,
        },
      }),
    )

    let resolvedBranches = await Promise.all(branchPromises)

    return resolvedBranches
      .map((branches, ii) =>
        DtoMapper.mapTravisTuplesToNodes(reposDto.repos[ii], branches, key),
      )
      .flat()
  }

  public async fetchBitriseNodes(key: string): Promise<Node[]> {
    let apps: BitrisePaginated<BitriseRepoDto> = await this.get({
      url: `https://api.bitrise.io/v0.1/apps`,
      headers: {
        Authorization: key,
      },
    })

    // retarted step, need to fetch branch names per repo first
    let branchNamesPromises = apps.data.map((r) =>
      this.get({
        url: `https://api.bitrise.io/v0.1/apps/${r.slug}/branches`,
        headers: {
          Authorization: key,
        },
      }),
    )

    let resolvedBranchNames: Array<BitrisePaginated<
      string
    >> = await Promise.all(branchNamesPromises)

    let nodesPromises = resolvedBranchNames.map((b, ii) =>
      this.fetchBitriseRepoBranches(apps.data[ii], b.data, key),
    )

    let resolvedNodes = await Promise.all(nodesPromises)

    return resolvedNodes.flat()
  }

  private async fetchBitriseRepoBranches(
    repo: BitriseRepoDto,
    branchNames: string[],
    key: string,
  ) {
    let branchesPromises = branchNames.map((name) => {
      let encodedName = name.replace(`#`, `%23`).replace(`&`, `%26`)

      return this.get({
        url: `https://api.bitrise.io/v0.1/apps/${repo.slug}/builds?branch=${encodedName}&limit=1`,
        headers: {
          Authorization: key,
        },
      })
    })

    let resolvedBranches: Array<BitrisePaginated<
      BitriseBranchDto
    >> = await Promise.all(branchesPromises)

    return resolvedBranches
      .map((b) => DtoMapper.mapBitriseTuplesToNode(repo, b.data, key))
      .flat()
  }

  public async fetchGithubActionNodes(
    key: string,
    slug: string,
  ): Promise<Node[]> {
    let workflowsMaster: GithubWorkflowsDto = await this.get({
      url: `https://api.github.com/repos/${slug}/actions/workflows`,
      headers: {
        Accept: `application/vnd.github.v3+json`,
        Authorization: `token ${key}`,
      },
    })

    let workflowsPromises = workflowsMaster.workflows.map((w) =>
      this.fetchGithubWorkflow(key, slug, w),
    )

    let resolvedWorkflows = await Promise.all(workflowsPromises)
    // @ts-ignore
    return resolvedWorkflows.filter((v) => v).flat()
  }

  private async fetchGithubWorkflow(
    key: string,
    slug: string,
    workflowDto: GithubWorkflowDto,
  ): Promise<Node | null> {
    let workflowInfo: GithubWorkflowInfoDto = await this.get({
      url: `https://api.github.com/repos/${slug}/actions/workflows/${workflowDto.id}/runs?per_page=1`,
      headers: {
        Accept: `application/vnd.github.v3+json`,
        Authorization: `token ${key}`,
      },
    })

    if (workflowInfo.workflow_runs.length > 0) {
      return DtoMapper.mapGithubActionTupleToNode(
        slug,
        workflowDto,
        workflowInfo.workflow_runs[0],
        key,
      )
    } else {
      return null
    }
  }

  public triggerCircleciRebuild(node: Node) {
    if (!node.buildUrl) {
      throw new Error(`Could not rebuild node without a known build url`)
    }

    return this.post({
      url: node.buildUrl,
      headers: {
        "Content-Type": `application/json`,
      },
    })
  }
}
