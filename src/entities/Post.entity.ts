import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category.entity";
import { User } from "./User.entity";
import { Reaction } from "./Reaction.entity";
import { Comment } from "./Comment.entity";
import { Field, ID, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  content?: string;

  @Field(() => String)
  @Column()
  html: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  summary?: string;

  @Field()
  @Column({ type: "text", unique: true })
  slug: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  published?: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column({ type: "date", nullable: true })
  publishedAt: Date;

  @Field(() => Int)
  @Column({ type: "int", nullable: true, default: 0 })
  likes: number;

  @Field(() => Int)
  @Column({ type: "int", nullable: true, default: 0 })
  dislikes: number;

  // when a comment is created: we increase ists value
  // when a comment is deleted: we decrease ists values
  @Field(() => Int)
  @Column({type: "int",default:0})
  commentsCount: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user: User;

  @ManyToMany(() => Category, (category) => category.posts)
  categories: Category[];

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
