import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course.entity";
import { Post } from "./Post.entity";

@ObjectType({ description: "The category to which a post belong" })
@Entity()
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "varchar", length: 75, unique: true })
  title: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  content?: string;

  @Field(() => [Post], {
    description: "Not recommend to get this when getting all categories",
  })
  @ManyToMany(() => Post, (post) => post.categories)
  @JoinTable()
  posts: Post[];

  @Field( () => [Course] )
  @ManyToMany(() => Course, (course) => course.categories)
  @JoinTable()
  courses: Course[];

  @Field(() => Int)
  postsCount: number;
}
