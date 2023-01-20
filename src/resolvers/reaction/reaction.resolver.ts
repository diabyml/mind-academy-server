import AppDataSource from "../../data-source";
import { Arg, Mutation, Resolver } from "type-graphql";
import { Reaction } from "../../entities/Reaction.entity";
import { ReactionInput } from "./reaction.input";

@Resolver(() => Reaction)
export class ReactionResolver {
  @Mutation(() => Boolean)
  async react(
    @Arg("data") { postId, userId, value }: ReactionInput
  ): Promise<boolean> {
    let userReaction = 1;

    if (!postId || !userId || !value) {
      return false;
    }

    if (value < 1) {
      userReaction = -1;
    }

    console.log("userReaction:", userReaction);

    // check if user has already reacted handle it here
    // user can change his reaction
    const reaction = await AppDataSource.getRepository(Reaction).findOne({
      where: { postId, userId },
    });

    // does the user already reacted to thiss post
    if (reaction) {
      if (reaction.value !== userReaction) {
        //user used to reac to this post and wanna change his mind
        console.log(
          "user use to react to this pot and want to change his mind"
        );

        await AppDataSource.transaction(async (tm) => {
          tm.query(
            `
            update reaction set value = $1
              where "postId" = $2 and "userId" = $3
          `,
            [userReaction, postId, userId]
          );

          if (userReaction === 1) {
            // its a like
            tm.query(
              `
                update post set likes = likes + 1 
                  where id =$1;
                `,
              [postId]
            );
          } else {
            // its a dislike
            tm.query(
              `
                  update post set likes = likes - 1 
                    where id =$1;
                  `,
              [postId]
            );
          }
        });

        return true;
      } else {
        // user want to make the same reaction
        return false;
      }
    }

    // user have never reacted to this post, so react for the first time
    await AppDataSource.transaction(async (transacionEntityManager) => {
      await transacionEntityManager
        .createQueryBuilder()
        .insert()
        .into(Reaction)
        .values({
          userId: userId,
          postId: postId,
          value: userReaction,
        })
        .execute();

      if (userReaction === 1) {
        // its a like
        transacionEntityManager.query(
          `
            update post set likes = likes + 1 
              where id =$1;
            `,
          [postId]
        );
      } else {
        // its a dislike
        transacionEntityManager.query(
          `
              update post set likes = likes - 1 
                where id =$1;
              `,
          [postId]
        );
      }
    });

    return true;
  }
}
