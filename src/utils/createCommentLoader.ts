// import DataLoader from "dataloader";
// import AppDataSource from '../data-source';


// // [1, 78, 8, 9]
// // [{id: 1, username: 'tim'}, {}, {}, {}]
// export const createCommentLoader = () =>
//   new DataLoader<number, number>(async (postIds) => {


//     const postsCommentsCounts: Array<number> = [];

//     postIds.forEach(async (postId) => {
//         const count = await AppDataSource.createQueryRunner().query(`
//         select COUNT(*) from "comment" where "postId" = $1;
//         `,[postId]);
//         postsCommentsCounts.push(count);
//     })



//     console.log('res:',postsCommentsCounts)
//     // // map ids to users
//     // const map: Record<string, number> = {};
//     // postIds.forEach((id) => {
//     //   map[id] = ;
//     // });

//     // const res = userIds.map((id) => {
//     //   return map[id];
//     // });

//     // return res;
//     return postsCommentsCounts
//   });
