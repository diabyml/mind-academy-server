import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment.entity";
import { Course } from "./Course.entity";
import { Post } from "./Post.entity";
import { Reaction } from "./Reaction.entity";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, nullable: false })
  username: string;

  @Field()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  intro?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  profile?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobile?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column({ nullable: true })
  lastLogin: Date;

  // relation fields, not sure if @Field() works on them, test later

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Course, (course) =>  course.user )
  courses: Course[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
