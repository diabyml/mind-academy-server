import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Course } from "./Course.entity";
import { Post } from "./Post.entity";
import { User } from "./User.entity";

@Entity()
export class Reaction {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @Column({ type: "int", nullable: true, default: null })
  value: number;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, (post) => post.reactions, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => Course, (course) => course.reactions, { onDelete: "CASCADE" })
  course: Course;
}
