import { TweetModel, ITweetModel } from "../../application/models/tweet-model";
import { Tweet, ITweet } from "../../domain/entities/tweet";

interface ITweetRepository {
  getTweet: (id: string) => Promise<ITweet>,
  getTweetsByUserId: (id: string) => Promise<ITweet[]>,
  getAllTweets: () => Promise<ITweet[]>,
  insertTweet: (tweet: ITweet) => Promise<ITweet>,
  insertTweets: (tweets: ITweet[]) => Promise<ITweet[]>,
  updateTweet: (id: string, update: object) => Promise<ITweet>,
  deleteTweet: (id: string) => Promise<ITweet>
}

export default ITweetRepository;

