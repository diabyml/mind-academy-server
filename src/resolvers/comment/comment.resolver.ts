import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import AppDataSource from "../../data-source";
import { Comment } from "../../entities/Comment.entity";
import { User } from "../../entities/User.entity";
import { isAuth } from "../../middlewares/isAuth";
import MyContext from "../../utils/MyContext";
import {
  NewCommentInput,
  PaginatedComments,
  PostCommentsInput,
} from "./comment.input";

@Resolver(Comment)
export class PostComments {
  @FieldResolver(() => User)
  async user(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return await userLoader.load(comment.userId);
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("data") data: NewCommentInput
  ): Promise<Comment | null> {
    // validate inputs
    // const errors:Array<FieldError> = [];

    // if(!data.content) {
    //     errors.push({ field:"content",message:"Contenu vide" })
    // }

    // if(!data.userId) {
    //     errors.push({ field:"userId",message:"Vous n'êtes pas connecté" })
    // }

    // if(!data.postId) {
    //     errors.push({ field:"postId",message:"aucun blog associé" })
    // }

    // if(errors.length > 0) {
    //     return errors;
    // }

    let result: Comment | null = null;
    await AppDataSource.transaction(async (transacionEntityManager) => {
      const res = await transacionEntityManager
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          postId: data.postId,
          userId: data.userId,
          content: data.content,
        })
        .returning("*")
        .execute();

      transacionEntityManager.query(`
      update post set "commentsCount" = "commentsCount" + 1 where id = ${data.postId};
      `);

      result = res.raw[0];
    });

    return result;
  }

  @Query(() => [Comment])
  async postCommentsWithoutPagination(
    @Arg('postId', () => String) postId: string
  ) {
    let result = await AppDataSource.createQueryRunner().query(
      `
        select * from "comment" 
            where "postId" = ${postId}
            order by "createdAt" desc ;
        `,
    );

    return result;
  }

  @Query(() => PaginatedComments)
  async postComments(
    @Arg("data") { postId, cursor, limit = 15 }: PostCommentsInput
  ): Promise<PaginatedComments> {
    const hasMoreBound = limit + 1;

    const replacements = [];

    if (cursor) {
      const parsedCursor = new Date(parseInt(cursor as string));
      console.log(parsedCursor);
      replacements.push(parsedCursor);
    }

    let result = await AppDataSource.createQueryRunner().query(
      `
        select * from "comment" 
            where "postId" = ${postId}
            ${cursor ? `and "createdAt" < $1` : ``} 
            order by "createdAt" desc 
            limit ${hasMoreBound} ;
        `,
      replacements
    );

    // console.log(result);

    if (result.length === hasMoreBound) {
      result.slice(0, hasMoreBound - 1);
    }

    return {
      data: result,
      hasMore: result.length === hasMoreBound,
    };
  }
}
