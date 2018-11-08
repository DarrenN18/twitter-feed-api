export interface IFollowerModel {
  user_id: string;
  follower_id: string;
}

export class FollowerModel implements IFollowerModel {
  public user_id: string;
  public follower_id: string;

  constructor( user_id: string, follower_id: string) {
    this.user_id = user_id;
    this.follower_id = follower_id;
  }
}