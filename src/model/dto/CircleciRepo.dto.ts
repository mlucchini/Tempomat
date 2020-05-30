export interface CircleciRepoDto {
  vcs_url: string;
  username: string;
  reponame: string;
  branches: Record<string, BranchDto>;
}

interface BranchDto {
  recent_builds?: BuildInfoDto[];
  running_builds?: BuildInfoDto[];
}

interface BuildInfoDto {
  pushed_at: string;
  vcs_revision: string;
  build_num: number;
  outcome: string;
}
