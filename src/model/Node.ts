import {VCS} from "./VCS.enum"
import {Status} from "./Status.enum"
import {Source} from "./Source"

export class Node {
  public id!: string
  public source!: Source
  public url!: string
  public label!: string
  public status!: Status
  public vcs?: VCS
  public key?: string
  public buildUrl?: string
  public date?: string
  public jobId?: string
}
