import { Follower, IFollower } from "../../domain/entities/follower";
import { User } from "../../domain/entities/user";
import { IUserFollowerInfoResponse } from "./user-repository-responses";
import IFollowerRepository from "./ifollower-repository";

class FollowerRepository implements IFollowerRepository {
  public static instance: IFollowerRepository;

  constructor() {
    if (!FollowerRepository.instance) {
      FollowerRepository.instance = this;
      return FollowerRepository.instance;
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getFollowerInfo(id: any): Promise<IUserFollowerInfoResponse> {
    try {
      const user = await User.findById(id).exec();
      const followers = await Follower.where("user_id", id).exec();
      const following = await Follower.where("follower_id", id).exec();
      
      return { user, followers: followers.map(x => x._id), following: following.map(x => x._id) };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param follower:  
   * @return Promise<any>
   */
  public async insertFollower(follower: IFollower): Promise<IFollower> {
    try {
      // @ts-ignore
      const insertedFollower = await follower.save(follower);
      return insertedFollower;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param followers:  
   * @return Promise<any>
   */
  public async insertFollowers(followers: IFollower[]): Promise<IFollower[]> {  
    try {
      const insertedFollowers = await Follower.insertMany(followers, { ordered: false });
      return insertedFollowers;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async deleteFollower(id: string): Promise<IFollower> {
    try {
      const deletedFollower = await Follower.remove({ '_id': id });
      return deletedFollower;
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

export default FollowerRepository;
