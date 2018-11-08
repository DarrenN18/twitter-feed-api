import { Request, Response } from "express";
import UserService from "../../application/services/user-service";
import TweetService from "../../application/services/tweet-service";

class UserController {
  private userService: UserService;
  private tweetService: TweetService;

  constructor(router, userService: UserService, tweetService: TweetService) {
    router.post("/users", this.insertUsers.bind(this));
    router.get("/users/:id", this.getUser.bind(this));
    router.get("/users", this.getAllUsers.bind(this));
    router.get("/users/followers/:id", this.getUserFollowerInfo.bind(this));
    router.put("/users/:id", this.updateUser.bind(this));
    router.delete("/users/:id", this.deleteUser.bind(this));
    
    this.userService = userService;
    this.tweetService = tweetService;
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async getUser(request: Request, response: Response): Promise<any> {
    const id = request.params.id;
    return this.userService.getUser(id)
      .then(userModel => {
        return response.status(200).send(userModel);
      })
      .catch(error => {
        return response.status(500).send({ error });
      });
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async getAllUsers(request: Request, response: Response): Promise<any> {
    return this.userService.getAllUsers()
      .then(userModel => {
        return response.status(200).send(userModel);
      })
      .catch(error => {
        return response.status(500).send({ error });
      });
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async getUserFollowerInfo(request: Request, response: Response): Promise<any> {
    const id = request.params.id;
    return this.userService.getFollowerInfo(id)
      .then(userFollowerInfoModel => {
        return response.status(200).send(userFollowerInfoModel);
      })
      .catch(error => {
        return response.status(500).send({ error });
      });
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async insertUsers(request: Request, response: Response) {
    const users = request.body;
    try {
      let result = null;
      if (users.length > 1) {
        result = await this.userService.insertUsers(users);
      } else if (users.length === 1) {
        result = await this.userService.insertUser(users[0]);
      }
      return response.status(201).send(result);
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async updateUser(request: Request, response: Response): Promise<any> {
    const id = request.body.id;
    const update = request.body.update;
    return this.userService.updateUser(id, update);
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async deleteUser(request: Request, response: Response): Promise<any> {
    try {
      const id = request.params.id;
      const deletedUser = await this.userService.deleteUser(id);
      // TODO
      const deletedTweets = [] // await this.tweetService.deleteTweetsByUserId(id);
      return response.status(200).send({ user: deletedUser, tweets: deletedTweets });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

export default UserController;
