import { Field, InputType, Int } from "type-graphql";

@InputType()
export class ReactionInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  value: number;
}
