import { Router } from "express";

// repositories
import FollowerRepository from "./data/repositories/follower-repository";
import TweetRepository from "./data/repositories/tweet-repository";
import UserRepository from "./data/repositories/user-repository";
// services
import TweetService from "./application/services/tweet-service";
import UserService from "./application/services/user-service";
// controllers
import DataImportController from "./controllers/data-import/data-import-controller";
import UserController from "./controllers/user/user-controller";
import TweetController from "./controllers/tweet/tweet-controller";

const baseRoute = "/api";

export class ConfigurationManager {

  public static instance: ConfigurationManager;
  private controllers: object;
  private services: object;
  private repositories: object;

  constructor() {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = this;
      this.repositories = {};
      this.services = {};
      this.controllers = {};
      return ConfigurationManager.instance;
    }
  }
  
  public configure(app) {
    const router = Router();
    this.configureRepositories();
    this.configureServices();
    this.configureControllers(router);
    app.use(baseRoute, router);
  }
  
  private configureRepositories() {
    const tweetRepository = new TweetRepository();
    const userRepository = new UserRepository();
    const followerRepository = new FollowerRepository();

    this.repositories["followerRepository"] = followerRepository;
    this.repositories["tweetRepository"] = tweetRepository;
    this.repositories["userRepository"] = userRepository;
  }

  private configureServices() {
    const tweetService = new TweetService(this.repositories["tweetRepository"]);
    const userService = new UserService(this.repositories["userRepository"], this.repositories["followerRepository"]);

    this.services["tweetService"] = tweetService;
    this.services["userService"] = userService;
  }
  
  private configureControllers(router) {
    const dataImportController = new DataImportController(router, this.services["userService"], this.services["tweetService"]);
    const tweetController = new TweetController(router, this.services["tweetService"]);
    const userController = new UserController(router, this.services["userService"], this.services["tweetService"]);
    
    this.controllers["dataImportController"] = dataImportController;
    this.controllers["tweetController"] = tweetController;
    this.controllers["userController"] = userController;
  }
}

const configurationManager = new ConfigurationManager();
export default configurationManager;
