import { Document, Schema, Model, model } from "mongoose";

export interface IUser extends Document{
  screenName: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatar: string;
  posts: number;
  followers: number;
  following: number;
  create_date: Date,
  update_date: Date,
}

export const UserSchema = new Schema({
  screenName: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  email: String,
  bio: String,
  avatar: String,
  posts: Number,
  followers: Number,
  following: Number,
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: Date
});

export const User: Model<IUser> = model<IUser>("User", UserSchema, "Users");