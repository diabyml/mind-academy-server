import { MigrationInterface, QueryRunner } from "typeorm";

export class alterPost1662846314800 implements MigrationInterface {
    name = 'alterPost1662846314800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "likes" integer DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "dislikes" integer DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "dislikes"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "likes"
        `);
    }

}
