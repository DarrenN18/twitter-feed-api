import { Document, Schema, Model, model } from "mongoose";

export interface ITweet extends Document {
  user_id: string;
  message: string;
  create_date: Date|number,
  update_date: Date|number
}

export const TweetSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    validate: /^([a-zA-Z0-9\S _]){1,140}$/
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: Date
});

export const Tweet: Model<ITweet> = model<ITweet>("Tweet", TweetSchema, "Tweets");
