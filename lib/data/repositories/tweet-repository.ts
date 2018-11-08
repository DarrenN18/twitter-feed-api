import { ITweet, Tweet } from "../../domain/entities/tweet";
import ITweetRepository from "./itweet-repository";
import { Model } from "mongoose";

class TweetRepository implements ITweetRepository {
  public static instance: TweetRepository;

  constructor() {
    if (!TweetRepository.instance) {
      TweetRepository.instance = this;
      return TweetRepository.instance;
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getTweet(id: string): Promise<ITweet> {
    try {
      const tweet = await Tweet.findById(id).exec();
      return tweet;
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
  public async getTweetsByUserId(id: string): Promise<ITweet[]> {
    try {
      const tweets = await Tweet.where("user_id", id).exec();
      return tweets;
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
  public async getAllTweets(): Promise<ITweet[]> {
    try {
      const tweets = await Tweet.find({});
      return tweets;
    } catch (error) {
      // Cast Error
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param user:  
   * @return Promise<any>
   */
  public async insertTweet(tweet: ITweet): Promise<ITweet> {
    try {
      // @ts-ignore
      const insertedTweet = await tweet.save(tweet);
      return insertedTweet;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param tweets:  
   * @return Promise<any>
   */
  public async insertTweets(tweets: ITweet[]): Promise<ITweet[]> {  
    try {
      const insertedTweets = await Tweet.insertMany(tweets, { ordered: false });
      return insertedTweets;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:
   * @param update: 
   * @return Promise<any>
   */
  public async updateTweet(id: string, update: object): Promise<ITweet|any> {
    const options: object = { new: true };
    return new Promise((resolve, reject) => Tweet.findByIdAndUpdate(id, update, options, function(error, tweet) {
      if (error) {
        return reject(error);
      }
      return resolve(tweet);
    }));
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async deleteTweet(id: string): Promise<ITweet> {
    try {
      const deletedTweet = await Tweet.remove({ '_id': id });
      return deletedTweet;
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

export default TweetRepository;
