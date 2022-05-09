import {collections} from "../database.service";
import ProductHistoryModel from "../model/productHistoryModel";
import UserModel from "../model/userModel";

export default class UserRepository {

    async getUserByUserId(userId: string) : Promise<UserModel>{

        // @ts-ignore
        return await collections.userModel?.findOne({userId: userId}) as UserModel;
    }
}
