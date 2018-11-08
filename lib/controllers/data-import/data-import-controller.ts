import { Request, Response } from "express";
import DataProcessor from "./data-processor";
import UserService from "../../application/services/user-service";
import TweetService from "application/services/tweet-service";


class DataImportController {
  private userService: UserService;
  private tweetService: TweetService;

  constructor(router, userService, tweetService) {
    router.post("/import", this.importFiles.bind(this));
    this.userService = userService;
    this.tweetService = tweetService;
  }

  public async importFiles(request: Request, response: Response) {
    try {
      // @ts-ignore
      const entities: {users: any, tweets: any, followers: any} = DataProcessor.getEntities(request.files.users, request.files.tweets);
      const users = await this.userService.insertUsers(entities.users);
      const followers = DataProcessor.updateFollowerMapping(entities.followers, users);
      const tweetModels = DataProcessor.updateTweetUserMapping(entities.tweets, users);
      const tweets = await this.tweetService.insertTweets(tweetModels);
      response.status(200).send({users, followers, tweets});
    } catch (error) {
      response.status(500).send(error);
    }

  }
}

export default DataImportController;
