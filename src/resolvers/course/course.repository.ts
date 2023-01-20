
import AppDataSource from '../../data-source';
import { Course } from '../../entities/Course.entity';
export const CourseRepository = AppDataSource.getRepository(Course).extend({
    // custorm methods here
});