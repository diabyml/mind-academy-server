import { MigrationInterface, QueryRunner } from "typeorm";

export class alterContactUs1665439209649 implements MigrationInterface {
    name = 'alterContactUs1665439209649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "isRead" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "isRead"`);
    }

}
