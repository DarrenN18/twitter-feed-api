import { Follower } from "../../domain/entities/follower";
import { Tweet } from "../../domain/entities/tweet";
import { IUser, User} from "../../domain/entities/user";
import IUserRepository from "./iuser-repository";
import { IUserResponse, IUserFollowerInfoResponse } from "./user-repository-responses";

class UserRepository implements IUserRepository {
  public static instance: UserRepository;

  constructor() {
    if (!UserRepository.instance) {
      UserRepository.instance = this;
      return UserRepository.instance;
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getUser(id: any): Promise<IUserResponse|any> {
    try {
      const user = await User.findById(id).exec();
      const tweets = await Tweet.where("user_id", id).count().exec();
      const followers = await Follower.where("user_id", id).count().exec();
      const following = await Follower.where("follower_id", id).count().exec();

      return { user, tweets, followers, following };
    } catch (error) {
      // Cast Error
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      // Cast Error
      return Promise.reject(error);
    }
  }

    /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getUsersByScreenName(screenNames: string[]): Promise<IUserResponse|any> {
    try {
      const users = await User.find({"screenName": { $in: screenNames }});
      return users;
    } catch (error) {
      // Cast Error
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getUserFollowerInfo(id: any): Promise<IUserFollowerInfoResponse|any> {
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
   * @param user:  
   * @return Promise<any>
   */
  public async insertUser(user: IUser): Promise<any> {
    try {
      // @ts-ignore
      const insertedUser = await user.save(user);
      return insertedUser;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param users:  
   * @return Promise<any>
   */
  public async insertUsers(users: IUser[]): Promise<any> {  
    try {
      const insertedUsers = await User.insertMany(users, { ordered: false });
      return insertedUsers;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:
   * @param update: 
   * @param options:  
   * @return Promise<any>
   */
  public async updateUser(id: any, update: object): Promise<any> {
    const options: object = { new: true };
    return new Promise((resolve, reject) => User.findByIdAndUpdate(id, update, options, function(error, documents) {
      if (error) {
        return reject(error);
      }
      return resolve(documents);
    }));
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async deleteUser(id: any): Promise<any> {
    try {
      const deletedUser = await User.remove({ '_id': id });
      return deletedUser;
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

export default UserRepository;
