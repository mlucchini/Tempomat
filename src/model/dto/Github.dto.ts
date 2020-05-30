export interface GithubWorkflowsDto {
  total_count: number
  workflows: GithubWorkflowDto[]
}

export interface GithubWorkflowDto {
  id: number
  name: string
  url: string
}

export interface GithubWorkflowInfoDto {
  total_count: number
  workflow_runs: GithubWorkflowRunInfo[]
}

export interface GithubWorkflowRunInfo {
  id: number
  run_number: number
  status: string
  conclusion: string
  created_at: string
}
