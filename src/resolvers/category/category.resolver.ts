import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import AppDataSource from "../../data-source";
import { Category } from "../../entities/Category.entity";
import { Post } from "../../entities/Post.entity";
import { ErrorType } from "../error.type";
import {
  AddCategoryInput,
  CategoryInput,
  CategoryResponse,
  PaginatedCategoryPostsInput,
} from "./category.input";
import { CategoryRepository } from "./category.repository";
import { PaginatedPosts } from "../post/post.input";

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    const repo = CategoryRepository;
    return repo.find();
  }

  @Mutation(() => CategoryResponse)
  async addCategory(
    @Arg("data") newCategoryData: AddCategoryInput
  ): Promise<CategoryResponse> {
    // validate input
    const errors: ErrorType[] = [];

    if (!newCategoryData.title) {
      errors.push({ field: "title", message: "Titre est vide" });
    }

    if (!newCategoryData.slug) {
      errors.push({ field: "slug", message: "Slug est vide" });
    }

    if (errors.length) {
      return {
        errors,
      };
    }

    // all inputs are valid here

    const repo = CategoryRepository;
    const category = repo.create({
      title: newCategoryData.title,
      slug: newCategoryData.slug,
      content: newCategoryData.content,
    });

    try {
      const res = await repo.save(category);
      // category inserted successfullty
      return {
        data: res,
      };
    } catch (error) {
      // user tried to insert a category that already exists (based on slug)
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        return {
          errors: [{ field: "slug", message: "Slug existe deja" }],
        };
      }

      return {
        errors: [
          {
            field: "unknown",
            message: "Unexpected error occured",
          },
        ],
      };
    }
  }

  // when getting all categories and get all its posts
  // without pagination is not an efficient query and category posts gets bigger
  @FieldResolver(() => [Post])
  async posts(@Root() category: Category) {
    const queryRunner = AppDataSource.createQueryRunner();
    const posts = await queryRunner.manager.query(
      `
     select p.* from category_posts_post cpp
	    inner join post p on p.id = cpp."postId"
	    where "categoryId" = $1;
      `,
      [category.id]
    );

    return posts;
  }

  @FieldResolver(() => [Post])
  async postsCount(@Root() category: Category) {
    const queryRunner = AppDataSource.createQueryRunner();
    const res = await queryRunner.manager.query(
      `
     select COUNT(p.*) from category_posts_post cpp
	    inner join post p on p.id = cpp."postId"
	    where "categoryId" = $1;
      `,
      [category.id]
    );

    console.log("count:", res);

    return res[0].count;
  }

  @Query(() => Category)
  async category(@Arg("data") { id }: CategoryInput): Promise<Category | null> {
    return CategoryRepository.findOne({ where: { id } });
  }

  @Query(() => PaginatedPosts, {
    description: "Paginating over a particular category posts",
  })
  async categoryPosts(
    @Arg("data") { categoryId, cursor, limit = 10 }: PaginatedCategoryPostsInput
  ): Promise<PaginatedPosts> {
    let parsedCursor = cursor ? new Date(parseInt(cursor)) : null;

    let hasMore = false;
    const hasMoreBound = limit + 1;

    const replacements = [categoryId] as any;

    if (parsedCursor) {
      replacements.push(parsedCursor);
    }

    const queryRunner = AppDataSource.createQueryRunner();
    let posts = await queryRunner.manager.query(
      `
     select p.* from category_posts_post cpp
	    inner join post p on p.id = cpp."postId"
      where "categoryId" = $1
      ${parsedCursor ? `and p."createdAt" < $2` : ""}
      order by "createdAt" desc
        limit ${hasMoreBound};
      `,
      replacements
    );

    if (posts.length === hasMoreBound) {
      // console.log("hasMore:true");
      hasMore = true;
      posts = posts.slice(0, hasMoreBound - 1);
    }

    return {
      hasMore,
      data: posts,
    };
  }
}
