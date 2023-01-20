import { MigrationInterface, QueryRunner } from "typeorm";

export class addContactUsTable1665435635746 implements MigrationInterface {
    name = 'addContactUsTable1665435635746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_us" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "region" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contact_us"`);
    }

}
