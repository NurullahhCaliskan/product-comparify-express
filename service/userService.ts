import UserRepository from "../repository/userRepository";
import UserModel from "../model/userModel";

export default class UserService {
    async getUserByUserId(userId: string):  Promise<UserModel>  {
        let userRepository = new UserRepository()

        return await userRepository.getUserByUserId(userId)
    }
}
