
import AppDataSource from '../../data-source';
import { Comment } from '../../entities/Comment.entity';

export const CommentRepository =  AppDataSource.getRepository(Comment).extend({
    // custom methods goes here
})