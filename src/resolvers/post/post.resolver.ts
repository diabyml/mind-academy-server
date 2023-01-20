import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import { Post } from "../../entities/Post.entity";
import { User } from "../../entities/User.entity";
import { isAuth } from "../../middlewares/isAuth";
import MyContext from "../../utils/MyContext";
import { UserRepository } from "../user/user.repository";
import {
  CreatePostInput,
  PaginatedPosts,
  PostsInput,
  UpdatePostInput,
} from "./post.input";
import { PostRepository } from "./post.repository";

@Resolver(() => Post)
export class PostResolver {

  @FieldResolver(() => String)
  content(@Root() post: Post) {
    return post?.content ? post?.content.slice(0, 50) : '';
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("data") { title, slug, content,html }: CreatePostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const repo = PostRepository;
    const userId = req.session.userId;
    const user = await UserRepository.findOne({ where: { id: userId } });
    const uuidStr = uuidv4();
    const post = repo.create({
      title,
      slug: `@${user?.username}-${slug}-${uuidStr}`,
      content,
      html,
      userId: req.session.userId,
    });
    return repo.save(post);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("data") { cursor, limit = 10 }: PostsInput
  ): Promise<PaginatedPosts> {
    const repo = PostRepository;

    let parsedCursor = cursor ? new Date(parseInt(cursor)) : null;

    let hasMore = false;
    const hasMoreBound = limit + 1;

    const replacements = [];

    if (parsedCursor) {
      replacements.push(parsedCursor);
    }

    let posts = await repo.query(
      `
      select * from post p
        ${parsedCursor ? `where p."createdAt" < $1` : ""}
        order by "createdAt" desc
        limit ${hasMoreBound}
    `,
      replacements
    );

    if (posts.length === hasMoreBound) {
      console.log("hasMore:true");
      hasMore = true;
      posts = posts.slice(0, hasMoreBound - 1);
    }

    return {
      data: posts,
      hasMore,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("slug", () => String) slug: string): Promise<Post | null> {
    return PostRepository.findOne({ where: { slug } });
  }

  @FieldResolver(() => User)
  async user(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return await userLoader.load(post.userId);
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number) {
    console.log(id);
    await PostRepository.delete(id);
    return true;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("data") { slug, title, content, html }: UpdatePostInput
  ): Promise<Post | null> {
    if (!slug) {
      // no identifier specified, can not proceed
      return null;
    }

    if (!title && !content && html) {
      // nothing to update
      return null;
    }

    // proceed to update
    const newPostData: { title?: string; content?: string, html?: string } = {};
    if (title) {
      newPostData.title = title;
    }

    if (content) {
      newPostData.content = content;
    }

    if(html) {
      newPostData.html = html;
    }

    const res = await PostRepository.createQueryBuilder()
      .update(Post)
      .set({ ...newPostData })
      .where(`slug = :slug`, { slug: slug })
      .returning("*")
      .execute();

    console.log("update res:", res);

    return res.raw[0];
  }
}
