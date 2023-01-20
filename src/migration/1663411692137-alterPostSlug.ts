import { MigrationInterface, QueryRunner } from "typeorm";

export class alterPostSlug1663411692137 implements MigrationInterface {
  name = "alterPostSlug1663411692137";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE post 
            ALTER COLUMN slug TYPE text;
        `);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
