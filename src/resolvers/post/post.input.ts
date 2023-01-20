import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Post } from "../../entities/Post.entity";

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  data: Post[];

  @Field()
  hasMore: boolean;
}

@InputType()
export class PostsInput {
  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  limit: number;
}

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  html: string;

  @Field(() => String)
  slug: string;
}

@InputType()
export class UpdatePostInput {
  @Field()
  slug: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  content?: string;


  @Field(() => String, { nullable: true})
  html?: string;
}
