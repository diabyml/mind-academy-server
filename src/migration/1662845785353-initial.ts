import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1662845785353 implements MigrationInterface {
    name = 'initial1662845785353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "comment" (
                "id" SERIAL NOT NULL,
                "content" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer,
                "postId" integer,
                CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reaction" (
                "userId" integer NOT NULL,
                "postId" integer NOT NULL,
                "value" integer,
                CONSTRAINT "PK_5fc09c259f83fb3cf898ec57dc3" PRIMARY KEY ("userId", "postId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "passwordHash" character varying NOT NULL,
                "firstName" character varying,
                "lastName" character varying,
                "intro" text,
                "profile" text,
                "mobile" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "lastLogin" TIMESTAMP,
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "post" (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "content" text,
                "summary" text,
                "slug" character varying(255) NOT NULL,
                "published" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "publishedAt" date,
                "userId" integer,
                CONSTRAINT "UQ_cd1bddce36edc3e766798eab376" UNIQUE ("slug"),
                CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "title" character varying(75) NOT NULL,
                "slug" character varying(100) NOT NULL,
                "content" text,
                CONSTRAINT "UQ_9f16dbbf263b0af0f03637fa7b5" UNIQUE ("title"),
                CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"),
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "category_posts_post" (
                "categoryId" integer NOT NULL,
                "postId" integer NOT NULL,
                CONSTRAINT "PK_c1c7f6f042e69969b16ac4a0670" PRIMARY KEY ("categoryId", "postId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3a1f3735235af2f4b702a3d398" ON "category_posts_post" ("categoryId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0cb77d79c53f0759b8153ec8a6" ON "category_posts_post" ("postId")
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reaction"
            ADD CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reaction"
            ADD CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "category_posts_post"
            ADD CONSTRAINT "FK_3a1f3735235af2f4b702a3d3987" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "category_posts_post"
            ADD CONSTRAINT "FK_0cb77d79c53f0759b8153ec8a62" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category_posts_post" DROP CONSTRAINT "FK_0cb77d79c53f0759b8153ec8a62"
        `);
        await queryRunner.query(`
            ALTER TABLE "category_posts_post" DROP CONSTRAINT "FK_3a1f3735235af2f4b702a3d3987"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"
        `);
        await queryRunner.query(`
            ALTER TABLE "reaction" DROP CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f"
        `);
        await queryRunner.query(`
            ALTER TABLE "reaction" DROP CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0cb77d79c53f0759b8153ec8a6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3a1f3735235af2f4b702a3d398"
        `);
        await queryRunner.query(`
            DROP TABLE "category_posts_post"
        `);
        await queryRunner.query(`
            DROP TABLE "category"
        `);
        await queryRunner.query(`
            DROP TABLE "post"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "reaction"
        `);
        await queryRunner.query(`
            DROP TABLE "comment"
        `);
    }

}
