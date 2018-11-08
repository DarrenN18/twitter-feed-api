import * as express from "express";
import * as bodyParser from "body-parser";
import * as fileUpload from "express-fileupload";
import ConfigurationManager from "./config-manager";
import database from "./data/database";

const port = 5000;

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.applyMiddleware();
    this.configure(this.app);
    this.configureDb();
    this.initCustomMiddleware();
    this.start();
  }

  private start(): void {
    this.app.listen(port, error => {
      console.log(
        "[%s] Listening on http://localhost:%d",
        process.env.NODE_ENV,
        port
      );
    });
  }

  private applyMiddleware(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(fileUpload({ preserveExtension: true }));
    // serving static files
    this.app.use(express.static("public"));
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  private configure(app): void {
    ConfigurationManager.configure(app);
  }

  private configureDb(): void {
    database
      .open()
      .then(response => response)
      .catch(error => error);
  }

  initCustomMiddleware() {
    if (process.platform === "win32") {
      require("readline")
        .createInterface({
          input: process.stdin,
          output: process.stdout
        })
        .on("SIGINT", () => {
          console.log("SIGINT: Closing MongoDB connection");
          database.close();
        });
    }

    process.on("SIGINT", () => {
      console.log("SIGINT: Closing MongoDB connection");
      database.close();
    });
  }
}

export default new App().app;
