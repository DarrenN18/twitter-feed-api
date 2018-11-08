import { Document, Schema, Model, model } from "mongoose";


export interface IFollower extends Document{
  user_id: string;
  follower_id: string;
  create_date: Date,
}

export const FollowerSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  follower_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  create_date: {
      type: Date,
      default: Date.now
  },
});

FollowerSchema.index({ user_id: Schema.Types.ObjectId, follower_id: Schema.Types.ObjectId }, { unique: true });

export const Follower: Model<IFollower> = model<IFollower>("Follower", FollowerSchema, "Followers");

