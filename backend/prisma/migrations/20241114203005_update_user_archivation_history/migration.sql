/*
  Warnings:

  - You are about to drop the `UserArchivationHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserArchivationHistory" DROP CONSTRAINT "UserArchivationHistory_archiver_id_fkey";

-- DropForeignKey
ALTER TABLE "UserArchivationHistory" DROP CONSTRAINT "UserArchivationHistory_unarchiver_id_fkey";

-- DropForeignKey
ALTER TABLE "UserArchivationHistory" DROP CONSTRAINT "UserArchivationHistory_user_id_fkey";

-- DropTable
DROP TABLE "UserArchivationHistory";

-- CreateTable
CREATE TABLE "user_archivation_history" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "archiver_id" TEXT NOT NULL,
    "archived_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unarchiver_id" TEXT,
    "unarchived_at" TIMESTAMP(3),

    CONSTRAINT "user_archivation_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_archivation_history" ADD CONSTRAINT "user_archivation_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_archivation_history" ADD CONSTRAINT "user_archivation_history_archiver_id_fkey" FOREIGN KEY ("archiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_archivation_history" ADD CONSTRAINT "user_archivation_history_unarchiver_id_fkey" FOREIGN KEY ("unarchiver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
