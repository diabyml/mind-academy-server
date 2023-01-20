import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Comment } from '../../entities/Comment.entity';

@InputType()
export class NewCommentInput {
  @Field(() => String,{ nullable: true})
  content?: string;

  @Field(() => Int)
  postId?: number;

  @Field(() => Int)
  userId?: number;
}

@InputType()
export class PostCommentsInput {
  @Field(() => Int)
  postId: number;

  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  limit: number;
}

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment],{ nullable: true})
  data: Comment[] | null;

  @Field()
  hasMore: boolean;
}


