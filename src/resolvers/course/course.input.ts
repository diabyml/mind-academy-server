import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Course } from '../../entities/Course.entity';

@ObjectType()
export class PaginatedCourses {
    @Field(() => [Course])
    data: Course[];
  
    @Field()
    hasMore: boolean;
}

@InputType()
export class CoursesInput {
  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

@InputType()
export class CreateCourseInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  summary: string;

  @Field(() => String)
  html: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  thumbnail: string;

  @Field(() => String)
  videoLink: string;
}

@InputType()
export class UpdateCourseInput {
  @Field()
  slug: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  summary?: string;


  @Field(() => String, { nullable: true})
  html?: string;

  @Field(() => String, { nullable: true})
  thumbnail?: string;

  @Field(() => String, { nullable: true})
  videoLink?: string;
}