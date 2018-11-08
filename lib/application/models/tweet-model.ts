import { IEntity } from "./ientity";

export interface ITweetModel extends IEntity {
  id: string;
  user_id: string;
  message: string;
  create_date: Date|number;
  update_date?: Date|number;
}

export class TweetModel implements ITweetModel {
  public id: string;
  public user_id: string;
  public message: string;
  public create_date: Date|number;
  public update_date?: Date|number;

  constructor( id: string, user_id: string, message: string, create_date: Date|number, update_date: Date|number = null) {
    this.id = id;
    this.user_id = user_id;
    this.message = message;
    this.create_date = create_date; 
    this.update_date = update_date;
  }
}
