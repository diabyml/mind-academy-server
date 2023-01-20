import { MigrationInterface, QueryRunner } from "typeorm";

export class addedCourseEntity1665782784650 implements MigrationInterface {
    name = 'addedCourseEntity1665782784650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "html" character varying NOT NULL, "summary" text NOT NULL, "slug" text NOT NULL, "thumbnail" text NOT NULL, "videoLink" text NOT NULL, "published" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "publishedAt" date, "likes" integer DEFAULT '0', "dislikes" integer DEFAULT '0', "commentsCount" integer NOT NULL DEFAULT '0', "userId" integer NOT NULL, CONSTRAINT "UQ_a101f48e5045bcf501540a4a5b8" UNIQUE ("slug"), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "thumbnail" ("id" SERIAL NOT NULL, "url" text NOT NULL, CONSTRAINT "PK_12afcbe5bdad28526b88dbdaf3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_courses_course" ("categoryId" integer NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_814b8e442df534ec1079b27ac08" PRIMARY KEY ("categoryId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6568734260443c798f18a63d5f" ON "category_courses_course" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ab70255e3fb3e53842c6a04bc" ON "category_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "reaction" ADD "courseId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "courseId" integer`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_3a7b58f3c385222e144ea6b0270" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_bceb52bbd16679020822f6d6f5d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_a96c50a5a085526d834b734ac4f" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_courses_course" ADD CONSTRAINT "FK_6568734260443c798f18a63d5f2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_courses_course" ADD CONSTRAINT "FK_0ab70255e3fb3e53842c6a04bcf" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_courses_course" DROP CONSTRAINT "FK_0ab70255e3fb3e53842c6a04bcf"`);
        await queryRunner.query(`ALTER TABLE "category_courses_course" DROP CONSTRAINT "FK_6568734260443c798f18a63d5f2"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_a96c50a5a085526d834b734ac4f"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_bceb52bbd16679020822f6d6f5d"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_3a7b58f3c385222e144ea6b0270"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "courseId"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP COLUMN "courseId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ab70255e3fb3e53842c6a04bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6568734260443c798f18a63d5f"`);
        await queryRunner.query(`DROP TABLE "category_courses_course"`);
        await queryRunner.query(`DROP TABLE "thumbnail"`);
        await queryRunner.query(`DROP TABLE "course"`);
    }

}
