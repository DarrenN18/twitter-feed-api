import ITweetRepository from "../../data/repositories/itweet-repository";
import { Tweet, ITweet } from "../../domain/entities/tweet";
import { TweetModel, ITweetModel } from "../../application/models/tweet-model";
import { Model } from "mongoose";

class TweetService {
  public static instance: TweetService;
  private repo: ITweetRepository;

  constructor(tweetRepo: ITweetRepository) {
    if (!TweetService.instance) {
      TweetService.instance = this;
      this.repo = tweetRepo;
      return TweetService.instance;
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getTweet(id): Promise<TweetModel|any> {
    try {
      const tweet: ITweet = await this.repo.getTweet(id);
      return new TweetModel(tweet.id, tweet.user_id, tweet.message, tweet.create_date, tweet.update_date);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async getTweetsByUserId(id): Promise<ITweetModel|any> {
    try {
      const tweets: ITweet[] = await this.repo.getTweetsByUserId(id);
      return tweets.map(tweet => new TweetModel(tweet.id, tweet.user_id, tweet.message, tweet.create_date, tweet.update_date))
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @return Promise<any>
   */
  public async getAllTweets(): Promise<ITweetModel[]> {
    try {
      const tweets: ITweet[] = await this.repo.getAllTweets();
      return tweets.map(tweet => new TweetModel(tweet.id, tweet.user_id, tweet.message, tweet.create_date, tweet.update_date))
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async insertTweet(tweet: ITweetModel): Promise<any> {
    let newtweet = new Tweet();
    newtweet.user_id = tweet.user_id;
    newtweet.message = tweet.message;
    newtweet.create_date = tweet.create_date;

    try {
      const response: ITweet = await this.repo.insertTweet(newtweet);
      return [new TweetModel(response.id, response.user_id, response.message, response.create_date, response.update_date)];
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async insertTweets(tweets: ITweetModel[]): Promise<any> {
    let tweetCollection = tweets.map(u => {
      let tweet = new Tweet();
      tweet.user_id = u.user_id;
      tweet.message = u.message;
      tweet.create_date = u.create_date;
      return tweet;
    });

    try {
      const response: ITweet[] = await this.repo.insertTweets(tweetCollection);
      return response.map(t => new TweetModel(t.id, t.user_id, t.message, t.create_date, t.update_date));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async updateTweet(id: any, update: object): Promise<any> {
    try {
      const response: ITweet = await this.repo.updateTweet(id, update);
      return new TweetModel(response.id, response.user_id, response.message, response.create_date, response.update_date);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description: 
   * @param id:  
   * @return Promise<any>
   */
  public async deleteTweet(id: any): Promise<TweetModel> {
    try {
      const response: ITweet = await this.repo.deleteTweet(id);
      return new TweetModel(response.id, response.user_id, response.message, response.create_date, response.update_date);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  
}

export default TweetService;
