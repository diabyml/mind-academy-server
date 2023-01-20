import AppDataSource from "../../data-source";
import { Category } from "../../entities/Category.entity";

export const CategoryRepository = AppDataSource.getRepository(Category).extend({
  // extend repo here
  findBySlug(slug: string) {
    this.findOne({ where: { slug: slug } });
  },
});
