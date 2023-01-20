import AppDataSource from "../../data-source";
import { Post } from "../../entities/Post.entity";

export const PostRepository = AppDataSource.getRepository(Post).extend({});
