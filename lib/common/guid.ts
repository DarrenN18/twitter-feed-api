import { v4 as uuidv4 } from "uuid";

export class Guid {

  public static newGuid(): string {
    return uuidv4().toUpperCase();
  }

  public static isValid(guid: string): boolean {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if(guid && !(guid.length === 36)) {
      return false;
    }
    return pattern.test(guid);
  }

  public id: string;
  
  constructor() {
    this.id = Guid.newGuid();
  }
}

export default Guid;