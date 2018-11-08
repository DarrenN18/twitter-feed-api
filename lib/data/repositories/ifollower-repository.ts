import { IFollower } from "../../domain/entities/follower";
import { IUserFollowerInfoResponse } from "./user-repository-responses";

interface IFollowerRepository {
  getFollowerInfo: (id: any) => Promise<IUserFollowerInfoResponse>
  insertFollower: (follower: IFollower) => Promise<IFollower>,
  insertFollowers: (followers: IFollower[]) => Promise<IFollower[]>,
  deleteFollower: (id: string) => Promise<IFollower>
}

export default IFollowerRepository
