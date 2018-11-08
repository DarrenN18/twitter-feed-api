import { IEntity } from "./ientity";

export interface IUserModel extends IEntity {
  id: string,
  screenName: string,
  firstName: string,
  lastName: string,
  email: string,
  bio: string,
  avatar: string,
  posts: number,
  followers: number,
  following: number,
}

export class UserModel implements IUserModel {
  public id: string;
  public screenName: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public bio: string;
  public avatar: string;
  public posts: number;
  public followers: number;
  public following: number;

  constructor( id: string, screenName: string, firstName: string = "", lastName: string = "", bio: string = "", avatar: string = "", posts: number, followers: number, following: number) {
    this.id = id;
    this.screenName = screenName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio;
    this.avatar = avatar;
    this.posts = posts;
    this.followers = followers;
    this.following = following;
  }
}

export interface IUserFollowerInfoModel extends IEntity {
  id: string,
  followers: string[],
  following: string[],
}

export class UserFollowerInfoModel implements IUserFollowerInfoModel {
  public id: string;
  public screenName: string;
  public followers: string[];
  public following: string[];

  constructor( id: string, screenName: string, followers: string[], following: string[]) {
    this.id = id;
    this.screenName = screenName;
    this.followers = followers;
    this.following = following;
  }

  /**
   * AddFollower
   */
  public AddToFollowers(id: string) {
    if (!this.followers.includes(id)) {
      this.followers.push(id);
    }
  }

  /**
   * AddToFollowing
   */
  public AddToFollowing(id: string) {
    if (!this.following.includes(id)) {
      this.following.push(id);
    }
  }
}