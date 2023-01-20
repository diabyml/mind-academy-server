import { MigrationInterface, QueryRunner } from "typeorm";

export class postWithUserId1663059989539 implements MigrationInterface {
    name = 'postWithUserId1663059989539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ALTER COLUMN "userId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ALTER COLUMN "userId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
