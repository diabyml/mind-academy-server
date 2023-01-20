// import DataLoader from "dataloader";
// import { Post } from "../entities/Post.entity";
// import AppDataSource from "../data-source";

// // interface IOptions {
// //   categoryId: number;
// //   cursor?: string;
// //   limit?: number;
// // }

// export const createPostLoader = () =>
//   new DataLoader<
//     {
//       categoryId: number;
//       cursor: string | null;
//       limit?: number;
//     },
//     Post
//   >(async (options) => {
//     const queryRunner = AppDataSource.createQueryRunner();

//     console.log("options:", options);

//     var posts = await queryRunner.manager.query(
//       `
//      select p.* from category_posts_post cpp
// 	    inner join post p on p.id = cpp."postId"
// 	    where "categoryId" = $1;
//       `,
//       replacements
//     );

//     console.log("posts from loader:", posts);

//     const map: Record<number, Post> = {};

//     posts.forEach((post: Post) => {
//       map[post.id] = post;
//     });

//     const res = options.map(({ categoryId }) => {
//       return map[categoryId];
//     });

//     return res;
//   });
