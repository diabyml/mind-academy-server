import { MigrationInterface, QueryRunner } from "typeorm";

export class alterPost1665695855014 implements MigrationInterface {
    name = 'alterPost1665695855014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "html" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "html"`);
    }

}
