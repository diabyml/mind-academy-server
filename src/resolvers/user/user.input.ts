import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../../entities/User.entity";
import { FieldError } from "../fieldError";

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  mobile?: string;
}

@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  password: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  data?: User;
}
