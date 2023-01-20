import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Category } from "../../entities/Category.entity";
import { FieldError } from "../fieldError";

@InputType({ description: "New category data" })
export class AddCategoryInput implements Partial<Category> {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  content?: string;
}

@ObjectType()
export class CategoryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Category, { nullable: true })
  data?: Category;
}

@ObjectType()
export class CategoriesResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Category], { nullable: true })
  data?: Category[];
}

@InputType()
export class PaginatedCategoryPostsInput {
  @Field(() => Int)
  categoryId: number;

  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  limit: number;
}

@InputType()
export class CategoryInput {
  @Field(() => Int)
  id: number;
}
