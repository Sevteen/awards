import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableAwardWithManyToMany1698306342627 implements MigrationInterface {
  name = 'AddTableAwardWithManyToMany1698306342627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."award_type_enum" AS ENUM('vouchers', 'products', 'giftcard')`);
    await queryRunner.query(
      `CREATE TABLE "award" ("id" SERIAL NOT NULL, "point" integer NOT NULL, "name" text NOT NULL, "image" character varying NOT NULL, "type" "public"."award_type_enum" NOT NULL, CONSTRAINT "PK_e887e4e69663925ebb60d3a7775" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e887e4e69663925ebb60d3a777" ON "award" ("id") `);
    await queryRunner.query(
      `CREATE TABLE "user_awards" ("userId" integer NOT NULL, "awardId" integer NOT NULL, CONSTRAINT "PK_dddca7aa94ff88158a04e189655" PRIMARY KEY ("userId", "awardId"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_853c282f0d5b8b2e12455ec552" ON "user_awards" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_00dc8f969d7ea17631ac91084b" ON "user_awards" ("awardId") `);
    await queryRunner.query(
      `CREATE TABLE "award_users" ("awardId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_30ecf4cb0cff7158042d798b725" PRIMARY KEY ("awardId", "userId"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_f14743b2b3c3f241ddd46994b2" ON "award_users" ("awardId") `);
    await queryRunner.query(`CREATE INDEX "IDX_10e08135f3d584d24c37497d66" ON "award_users" ("userId") `);
    await queryRunner.query(
      `ALTER TABLE "user_awards" ADD CONSTRAINT "FK_853c282f0d5b8b2e12455ec5527" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_awards" ADD CONSTRAINT "FK_00dc8f969d7ea17631ac91084b7" FOREIGN KEY ("awardId") REFERENCES "award"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "award_users" ADD CONSTRAINT "FK_f14743b2b3c3f241ddd46994b26" FOREIGN KEY ("awardId") REFERENCES "award"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "award_users" ADD CONSTRAINT "FK_10e08135f3d584d24c37497d66b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "award_users" DROP CONSTRAINT "FK_10e08135f3d584d24c37497d66b"`);
    await queryRunner.query(`ALTER TABLE "award_users" DROP CONSTRAINT "FK_f14743b2b3c3f241ddd46994b26"`);
    await queryRunner.query(`ALTER TABLE "user_awards" DROP CONSTRAINT "FK_00dc8f969d7ea17631ac91084b7"`);
    await queryRunner.query(`ALTER TABLE "user_awards" DROP CONSTRAINT "FK_853c282f0d5b8b2e12455ec5527"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_10e08135f3d584d24c37497d66"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f14743b2b3c3f241ddd46994b2"`);
    await queryRunner.query(`DROP TABLE "award_users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_00dc8f969d7ea17631ac91084b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_853c282f0d5b8b2e12455ec552"`);
    await queryRunner.query(`DROP TABLE "user_awards"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e887e4e69663925ebb60d3a777"`);
    await queryRunner.query(`DROP TABLE "award"`);
    await queryRunner.query(`DROP TYPE "public"."award_type_enum"`);
  }
}
