import { IFormData } from "../application/models/form-data";
import { UserFollowerInfoModel, UserModel } from "../application/models/user-model";
import { TweetModel } from "../application/models/tweet-model";
import Guid from "../common/guid";
import { FollowerModel } from "../application/models/follower-model";

const Delimiter = "\r\n";
const Keyword = "follows";
const Encoding = "utf8";
const MinCharacterLength = 3;

class DataProcessor {
  private userCache: object;
  private followerCache: object;

  public static instance: DataProcessor;
  constructor() {
    if (!DataProcessor.instance) {
      this.userCache = {};
      DataProcessor.instance = this;
      return DataProcessor.instance;
    }
  }

  public getEntities(userFormData: IFormData, tweetFormData: IFormData): object {
    // Initialize collections
    this.userCache = {};
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
      return this.parseUserData(userData, this.userCache, this.followerCache);
    }
    throw new Error("Invalid file type supplied for User data.");
  }

  /**
   * updateTweetUserMapping
   */
  public updateTweetUserMapping(tweetModels: TweetModel[], userModels: UserModel[]) {
    let userMapping = {};
    let tweets = [];

    userModels.forEach(u => {
      userMapping[u.screenName] = u.id; 
    })

    tweetModels.forEach(tweetModel => {
        tweetModel.user_id = userMapping[tweetModel.user_id];
        tweets.push(tweetModel);
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
  public parseUserData(userData: string, userCache: object, followerCache: object): UserFollowerInfoModel[]|any {
    try {
      const lines = userData.split(Delimiter);
      lines.forEach((line, idx) => {
        let index = line.trim().indexOf(Keyword);
        if (index > MinCharacterLength) {
          let follower = line.substr(0, index - 1).trim();
          let followedUsers = line.substr(index + Keyword.length).split(",");
          if (!userCache.hasOwnProperty(follower)) {
            userCache[follower] = new UserFollowerInfoModel(Guid.newGuid(), follower, [], []);
          }
  
          followedUsers.forEach(u => {
            let followedUser = u.trim();
            if (!userCache.hasOwnProperty(followedUser)) {
              userCache[followedUser] = new UserFollowerInfoModel(Guid.newGuid(), followedUser, [], []);
            }

            if (!followerCache.hasOwnProperty(followedUser)) {
              followerCache[followedUser] = [];
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
      return this.parseTweetData(tweetData, this.userCache);
    }
    throw new Error("Invalid file type supplied for Tweet data.");
  }

  /**
   * parseTweetData
   */
  public parseTweetData(tweetData: string, userCache: object): object {
    const tweets = [];
    try {
      const lines = tweetData.split(Delimiter);
      lines.forEach((line, idx) => {
        let index = line.trim().indexOf(">");
        if (index > MinCharacterLength) {
          const screenName = line.substr(0, index).trim();
          const message = line.substr(index + 1).trim();
          if (userCache.hasOwnProperty(screenName)) {
            const user = userCache[screenName];
            tweets.push(new TweetModel(Guid.newGuid(), user.screenName, message, Date.now(), null));
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

    return tweets;
  }
  
}

const dataProcessor = new DataProcessor();
export default dataProcessor;
