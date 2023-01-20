import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity, ManyToMany,
  ManyToOne,
  OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Category } from "./Category.entity";
import { Comment } from "./Comment.entity";
import { Reaction } from "./Reaction.entity";
import { User } from "./User.entity";

@Entity()
@ObjectType()
export class Course {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 255 })
  title: string;

  @Field(() => String)
  @Column()
  html: string;

  @Field()
  @Column({ type: "text" })
  summary: string;

  @Field()
  @Column({ type: "text", unique: true })
  slug: string;

   // @OneToOne(() => Thumbnail)
  // @JoinColumn()
  // thumbnail: Thumbnail;

  @Column('text')
  @Field()
  thumbnail: string;

  @Column('text')
  @Field()
  videoLink: string;

  @Field()
  textSnippet: string;

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
  @Column({ type: "int", default: 0 })
  commentsCount: number;

 

  @Column()
  @Field(() => Int)
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.courses, { onDelete: "CASCADE" })
  user: User;

  @ManyToMany(() => Category, (category) => category.courses)
  categories: Category[];

  @OneToMany(() => Reaction, (reaction) => reaction.course)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.course)
  comments: Comment[];
}

@Entity()
@ObjectType()
export class Thumbnail {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  url: string;
}
