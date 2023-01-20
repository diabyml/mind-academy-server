import DataLoader from "dataloader";
import { In } from "typeorm";
import { User } from "../entities/User.entity";
import { UserRepository } from "../resolvers/user/user.repository";

// [1, 78, 8, 9]
// [{id: 1, username: 'tim'}, {}, {}, {}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const repo = UserRepository;

    const users = await repo.find({ where: { id: In(userIds as number[]) } });

    // console.log("loader ids:", userIds);
    // console.log("loader user:", users);

    // map ids to users
    const map: Record<string, User> = {};
    users.forEach((u) => {
      map[u.id] = u;
    });

    const res = userIds.map((id) => {
      return map[id];
    });

    return res;
  });
