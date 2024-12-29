/*
  Warnings:

  - You are about to drop the column `archived_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `archiver_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `is_archived` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_archiver_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "archived_at",
DROP COLUMN "archiver_id",
DROP COLUMN "is_archived";

-- CreateTable
CREATE TABLE "UserArchivationHistory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "archiver_id" TEXT NOT NULL,
    "archived_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unarchiver_id" TEXT,
    "unarchived_at" TIMESTAMP(3),

    CONSTRAINT "UserArchivationHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserArchivationHistory" ADD CONSTRAINT "UserArchivationHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArchivationHistory" ADD CONSTRAINT "UserArchivationHistory_archiver_id_fkey" FOREIGN KEY ("archiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArchivationHistory" ADD CONSTRAINT "UserArchivationHistory_unarchiver_id_fkey" FOREIGN KEY ("unarchiver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
