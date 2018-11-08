import { IFormData } from "../../application/models/form-data";
import { UserFollowerInfoModel, UserModel } from "../../application/models/user-model";
import { TweetModel } from "../../application/models/tweet-model";
import Guid from "../../common/guid";
import { FollowerModel } from "../../application/models/follower-model";

const Delimiter = "\r\n";
const Keyword = "follows";
const Encoding = "utf8";
const MinCharacterLength = 3;

class DataProcessor {
  private userCache: object;
  private followerCache: object;
  private tweetCache: object;

  public static instance: DataProcessor;
  constructor() {
    if (!DataProcessor.instance) {
      this.userCache = {};
      this.tweetCache = {};
      DataProcessor.instance = this;
      return DataProcessor.instance;
    }
  }

  public getEntities(userFormData: IFormData, tweetFormData: IFormData): object {
    // Initialize collections
    this.userCache = {};
    this.tweetCache = {};
    this.followerCache = {};
    // TODO
    const users: UserFollowerInfoModel[] = this.getUsers(userFormData);
    const tweets: object = this.getTweets(tweetFormData);
    return { users, tweets, followers: this.followerCache };
  }

  /**
   * getUsers
   */
  public getUsers(userFormData: IFormData): UserFollowerInfoModel[]|any {
    if (this.isFormDataValid(userFormData)) {
      const userData = userFormData.data.toString(Encoding);
      return this.parseUserData(userData);
    }
    throw new Error("Invalid file type supplied for User data.");
  }

  /**
   * updateTweetUserMapping
   */
  public updateTweetUserMapping(tweetMapping: object, userModels: UserModel[]) {
    let userMapping = {};
    let tweets = [];

    userModels.forEach(u => {
      userMapping[u.screenName] = u.id; 
    })

    Object.keys(tweetMapping).forEach(key => {
      tweetMapping[key].forEach((tweetModel: TweetModel) => {
        tweetModel.user_id = userMapping[key];
        tweets.push(tweetModel);
      });
    });

    return tweets;
  }

  /**
   * updateFollowerMapping
   */
  public updateFollowerMapping(followerMapping: object, userModels: UserModel[]) {
    let userMapping = {};
    let followers = [];

    userModels.forEach(u => {
      userMapping[u.screenName] = u.id; 
    });

    Object.keys(followerMapping).forEach(key => {
      followerMapping[key].forEach((followerModel: FollowerModel) => {
        followerModel.user_id = userMapping[key];
        followerModel.follower_id = userMapping[followerModel.follower_id];
        followers.push(followerModel);
      });
    });

    return followers;
  }
  
  /**
   * isFormDataValid
   */
  private isFormDataValid(formData: IFormData): boolean {
    return ((formData.name.indexOf(".txt") > 1) && 
      (formData.data.length > 0) &&
      (formData.encoding === "7bit") && 
      (formData.mimetype === "text/plain"));
  }

  /**
   * parseUserData
   */
  private parseUserData(userData: string): UserFollowerInfoModel[]|any {
    try {
      const lines = userData.split(Delimiter);
      lines.forEach((line, idx) => {
        let index = line.trim().indexOf(Keyword);
        if (index > MinCharacterLength) {
          let follower = line.substr(0, index - 1).trim();
          let followedUsers = line.substr(index + Keyword.length).split(",");
          if (!this.userCache.hasOwnProperty(follower)) {
            this.userCache[follower] = new UserFollowerInfoModel(Guid.newGuid(), follower, [], []);
          }
  
          followedUsers.forEach(u => {
            let followedUser = u.trim();
            if (!this.userCache.hasOwnProperty(followedUser)) {
              this.userCache[followedUser] = new UserFollowerInfoModel(Guid.newGuid(), followedUser, [], []);
            }

            if (!this.followerCache.hasOwnProperty(followedUser)) {
              this.followerCache[followedUser] = [];
            }

            if (!this.followerCache[followedUser].includes(follower)) {
              this.followerCache[followedUser].push(new FollowerModel(followedUser, follower));
            }

          });
        } else if (line.length > 0 && index === -1) {
          throw new Error(`Invalid user data on line ${idx}.`);
        }
      });
    } catch (error) {
      return error;
    }
  
    return Object.keys(this.userCache).map(key => this.userCache[key]);
  }

  /**
   * getTweets
   */
  public getTweets(tweetFormData: IFormData): object {
    if (this.isFormDataValid(tweetFormData)) {
      const tweetData = tweetFormData.data.toString(Encoding);
      return this.parseTweetData(tweetData);
    }
    throw new Error("Invalid file type supplied for Tweet data.");
  }

  /**
   * parseTweetData
   */
  private parseTweetData(tweetData: string): object {
    try {
      const lines = tweetData.split(Delimiter);
      lines.forEach((line, idx) => {
        let index = line.trim().indexOf(">");
        if (index > MinCharacterLength) {
          const screenName = line.substr(0, index).trim();
          const message = line.substr(index + 1).trim();
          if (this.userCache.hasOwnProperty(screenName)) {
            if (!this.tweetCache.hasOwnProperty(screenName)) {
              this.tweetCache[screenName] = [];
            }
            // The tweet can be associated with a user in the existing cache
            const user = this.userCache[screenName];
            this.tweetCache[screenName].push(new TweetModel(Guid.newGuid(), user.id, message, Date.now(), null));
          } else if (screenName.length > 0) {
            // Create the user?
          }
  
        } else if (line.length > 0 && index === -1) {
          throw new Error(`Invalid tweet data on line ${idx}.`);
        }
      });
    } catch (error) {
      return error;
    }

    return this.tweetCache;
  }
  
}

const dataProcessor = new DataProcessor();
export default dataProcessor;
