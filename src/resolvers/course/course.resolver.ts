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
import { Course } from "../../entities/Course.entity";
import {
  CoursesInput,
  CreateCourseInput,
  PaginatedCourses,
  UpdateCourseInput,
} from "./course.input";
import { CourseRepository } from "./course.repository";
import { User } from "../../entities/User.entity";
import MyContext from "../../utils/MyContext";
import { isAuth } from "../../middlewares/isAuth";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "../user/user.repository";

@Resolver(() => Course)
export class CourseResolver {
  @FieldResolver(() => User)
  async user(@Root() course: Course, @Ctx() { userLoader }: MyContext) {
    return await userLoader.load(course.userId);
  }

  @FieldResolver(() => String)
  textSnippet(@Root() course: Course) {
    return course.summary ? course.summary.slice(0, 50) : "";
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuth)
  async createCourse(
    @Arg("data")
    { slug, title, summary, html, thumbnail, videoLink }: CreateCourseInput,
    @Ctx() { req }: MyContext
  ) {
    const repo = CourseRepository;
    const userId = req.session.userId;
    const user = await UserRepository.findOne({ where: { id: userId } });
    const uuidStr = uuidv4();

    const course = repo.create({
      title,
      slug: `@${user?.username}-${slug}-${uuidStr}`,
      summary,
      html,
      thumbnail,
      videoLink,
      userId: req.session.userId,
    });
    return repo.save(course);
  }

  @Query(() => PaginatedCourses)
  async courses(
    @Arg("data") { cursor, limit = 10 }: CoursesInput
  ): Promise<PaginatedCourses> {
    const repo = CourseRepository;

    let parsedCursor = cursor ? new Date(parseInt(cursor)) : null;

    let hasMore = false;
    const hasMoreBound = limit + 1;

    const replacements = [];

    if (parsedCursor) {
      replacements.push(parsedCursor);
    }

    let courses = await repo.query(
      `
            select * from course c
              ${parsedCursor ? `where c."createdAt" < $1` : ""}
              order by "createdAt" desc
              limit ${hasMoreBound}
          `,
      replacements
    );

    if (courses.length === hasMoreBound) {
      console.log("hasMore:true");
      hasMore = true;
      courses = courses.slice(0, hasMoreBound - 1);
    }

    return {
      data: courses,
      hasMore,
    };
  }

  @Mutation(() => Course, { nullable: true })
  async updateCourse(
    @Arg("data")
    { slug, title, summary, html, thumbnail, videoLink }: UpdateCourseInput
  ): Promise<Course | null> {
    if (!slug) {
      // no identifier specified, can not proceed
      return null;
    }

    if (!title && !summary && !html && !thumbnail && !videoLink) {
      // nothing to update
      return null;
    }

    const newCourseData: {
      title?: string;
      summary?: string;
      html?: string;
      thumbnail?: string;
      videoLink?: string;
    } = {};

    if (title) {
      newCourseData.title = title;
    }

    if (summary) {
      newCourseData.summary = summary;
    }

    if (html) {
      newCourseData.html = html;
    }

    if (thumbnail) {
      newCourseData.thumbnail = thumbnail;
    }

    if (videoLink) {
      newCourseData.videoLink = videoLink;
    }

    const res = await CourseRepository.createQueryBuilder()
      .update(Course)
      .set({ ...newCourseData })
      .where(`slug = :slug`, { slug: slug })
      .returning("*")
      .execute();

    console.log("updated res:", res);

    return res.raw[0];
  }

  @Query(() => Course, { nullable: true })
  async course(
    @Arg("slug", () => String) slug: string
  ): Promise<Course | null> {
    return CourseRepository.findOne({ where: { slug } });
  }

  @Mutation(() => Boolean)
  async deleteCourse(@Arg("id", () => Int) id: number) {
    console.log(id);
    await CourseRepository.delete(id);
    return true;
  }
}
