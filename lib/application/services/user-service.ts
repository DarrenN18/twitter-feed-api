import IUserRepository from "../../data/repositories/iuser-repository";
import { IUserResponse, IUserFollowerInfoResponse } from "../../data/repositories/user-repository-responses";
import { IUserModel, UserModel, IUserFollowerInfoModel, UserFollowerInfoModel } from "../models/user-model";
import { User, IUser } from "../../domain/entities/user";
import IFollowerRepository from "data/repositories/ifollower-repository";

class UserService {
  public static instance: UserService;
  private userRepo: IUserRepository;
  private followerRepo: IFollowerRepository;

  constructor(userRepo: IUserRepository, followerRepo: IFollowerRepository) {
    if (!UserService.instance) {
      UserService.instance = this;
      this.userRepo = userRepo;
      this.followerRepo = followerRepo;
      return UserService.instance;
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getUser(id): Promise<IUserModel> {
    try {
      const response: IUserResponse = await this.userRepo.getUser(id);
      const {user, tweets, followers, following} = response;
      return new UserModel(user.id, user.screenName, user.firstName, user.lastName, user.bio, user.avatar, tweets, followers, following);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @return Promise<any>
   */
  public async getAllUsers(): Promise<IUserModel[]> {
    try {
      const response: IUser[] = await this.userRepo.getAllUsers();
      return response.map(u => new UserModel(u.id, u.screenName, u.firstName, u.lastName, u.bio, u.avatar, 0, 0, 0));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getFollowerInfo(id: string): Promise<IUserFollowerInfoModel> {
    try {
      const response: IUserFollowerInfoResponse = await this.followerRepo.getFollowerInfo(id);
      const { user, followers, following } = response;
      return new UserFollowerInfoModel(user.id, user.screenName, followers, following);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async insertUser(user: IUserModel): Promise<IUserModel[]> {
    let newUser = new User();
    newUser.screenName = user.screenName;
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.bio = user.bio;
    newUser.avatar = user.avatar;

    try {
      const response: IUser = await this.userRepo.insertUser(newUser);
      return [new UserModel(response.id, response.screenName, response.firstName, response.lastName, response.bio, response.avatar, 0, 0, 0)];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async insertUsers(users: IUserModel[]): Promise<IUserModel[]> {
    let userCollection = users.map(u => {
      let user = new User();
      user.screenName = u.screenName;
      user.firstName = u.firstName;
      user.lastName = u.lastName;
      user.email = u.email;
      user.bio = u.bio;
      user.avatar = u.avatar;
      return user;
    });

    try {
      const response: IUser[] = await this.userRepo.insertUsers(userCollection);
      return response.map(u => new UserModel(u.id, u.screenName, u.firstName, u.lastName, u.bio, u.avatar, 0, 0, 0));
    } catch (error) {
      if (error.name && error.name === "BulkWriteError" && error.code === 11000) {
        const existingUsers: IUser[] = await this.userRepo.getUsersByScreenName(users.map(u => u.screenName));
        return existingUsers.map(u => new UserModel(u.id, u.screenName, u.firstName, u.lastName, u.bio, u.avatar, u.posts, u.followers, u.following));
      }
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async updateUser(id: any, update: object): Promise<IUserModel[]> {
    try {
      const response: IUser = await this.userRepo.updateUser(id, update);
      return [new UserModel(response.id, response.screenName, response.firstName, response.lastName, response.bio, response.avatar, 0, 0, 0)];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async deleteUser(id: any): Promise<IUserModel[]> {
    try {
      const response: IUser = await this.userRepo.deleteUser(id);
      return [new UserModel(response.id, response.screenName, response.firstName, response.lastName, response.bio, response.avatar, 0, 0, 0)];
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default UserService;
