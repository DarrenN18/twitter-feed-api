import * as mongoose from "mongoose";
const connectionString = "mongodb://admin:password1@ds125723.mlab.com:25723/tweet-app-db";

let connection = null;

export class Database {

  public static instance: Database;

  constructor() {
    if (!Database.instance) {
      Database.instance = this;
      return Database.instance;
    }
  }

  public async open(): Promise<any> {
    const options = { useNewUrlParser: true , promiseLibrary: global.Promise };
    mongoose.connect(
      connectionString,
      options,
      err => {
        if (err) {
          console.log("mongoose.connect() failed: " + err);
          return Promise.reject(err);
        }
      }
    );
    connection = mongoose.connection;

    mongoose.connection.on("error", err => {
      console.log("MongoDB connect failed: " + err);
      return Promise.reject(err);
    });

    mongoose.connection.once("open", () => {
      console.log("MongoDB connected.");
      return Promise.resolve(true);
    });
  }

  public close() {
    connection.close(() => {
      process.exit(0);
    });
  }
}

const database = new Database();
export default database;

