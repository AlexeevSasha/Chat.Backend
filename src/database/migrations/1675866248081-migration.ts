import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1675866248081 implements MigrationInterface {
    name = 'migration1675866248081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatorId" uuid, "recipientId" uuid, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_761a5583cb503b1124b174e13f" ON "conversations" ("creatorId", "recipientId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_761a5583cb503b1124b174e13f"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
    }

}
