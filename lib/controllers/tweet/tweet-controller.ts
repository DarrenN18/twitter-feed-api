import { Request, Response } from "express";
import TweetService from "../../application/services/tweet-service";

class TweetController {
  private tweetService: TweetService;

  constructor(router, tweetService: TweetService) {
    router.post("/tweets", this.insertTweets.bind(this));
    router.get("/tweets/:id", this.getTweet.bind(this));
    router.get("/tweets", this.getAllTweets.bind(this));
    router.put("/tweets/:id", this.updateTweet.bind(this));
    router.delete("/tweets/:id", this.deleteTweet.bind(this));
    
    this.tweetService = tweetService;
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async getTweet(request: Request, response: Response): Promise<any> {
    const id = request.params.id;
    return this.tweetService.getTweet(id)
      .then(tweetModel => {
        return response.status(200).send(tweetModel);
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
  public async getAllTweets(request: Request, response: Response): Promise<any> {
    return this.tweetService.getAllTweets()
      .then(tweetModels => {
        return response.status(200).send(tweetModels);
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
  public async insertTweets(request: Request, response: Response) {
    const tweets = request.body;
    try {
      let result = null;
      if (tweets.length > 1) {
        result = await this.tweetService.insertTweets(tweets);
      } else if (tweets.length === 1) {
        result = await this.tweetService.insertTweet(tweets[0]);
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
  public async updateTweet(request: Request, response: Response): Promise<any> {
    const id = request.body.id;
    const update = request.body.update;
    return this.tweetService.updateTweet(id, update);
  }

  /**
   * @description: 
   * @param request:
   * @param response:
   * @return Promise<any>
   */
  public async deleteTweet(request: Request, response: Response): Promise<any> {
    try {
      const id = request.params.id;
      const deletedTweets = await this.tweetService.deleteTweet(id);
      return response.status(200).send({ tweets: deletedTweets });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

export default TweetController;
