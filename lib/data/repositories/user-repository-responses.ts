import { IUser } from "domain/entities/user";

export interface IUserResponse {
  user: IUser,
  tweets: number,
  followers: number,
  following: number
}

export interface IUserFollowerInfoResponse {
  user: IUser,
  followers: string[],
  following: string[]
}