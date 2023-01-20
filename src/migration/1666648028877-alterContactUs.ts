import { MigrationInterface, QueryRunner } from "typeorm";

export class alterContactUs1666648028877 implements MigrationInterface {
    name = 'alterContactUs1666648028877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "createdAt"`);
    }

}
