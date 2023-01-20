import AppDataSource from "../../data-source";
import { User } from "../../entities/User.entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByUsernameOrEmail(usernameOrEmail: string, isEmail: boolean) {
    return this.findOne({
      where: isEmail
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });
  },
});
