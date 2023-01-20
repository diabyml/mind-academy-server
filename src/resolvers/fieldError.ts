import { Field, ObjectType } from "type-graphql";
import { ErrorType } from "./error.type";

@ObjectType()
export class FieldError implements ErrorType {
  @Field()
  field: string;
  @Field()
  message: string;
}
