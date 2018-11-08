import { IUser } from "../../domain/entities/user";

interface IUserRepository {
  getUser: (id: any) => Promise<any>,
  getAllUsers: () => Promise<IUser[]>,
  getUsersByScreenName: (screenNames: string[]) => Promise<IUser[]>,
  getUserFollowerInfo: (id: any) => Promise<any>,
  insertUser: (user: IUser) => Promise<IUser>,
  insertUsers: (users: IUser[]) => Promise<IUser[]>,
  updateUser: (id: any, update: object) => Promise<IUser>,
  deleteUser: (id: any) => Promise<IUser>
}

export default IUserRepository;
