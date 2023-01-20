import { Field, ID, Int, ObjectType } from "type-graphql";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Course } from "./Course.entity";

import { Post } from "./Post.entity";
import { User } from "./User.entity";

@Entity()
@ObjectType()
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true, default: null })
  content?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => Int)
  @Column()
  postId: number;
  

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => Course, (course) => course.comments, { onDelete: "CASCADE" })
  course: Course;
}
