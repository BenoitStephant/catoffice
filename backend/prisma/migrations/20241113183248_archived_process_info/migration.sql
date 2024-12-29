-- AlterTable
ALTER TABLE "user" ADD COLUMN     "archived_at" TIMESTAMP(3),
ADD COLUMN     "archiver_id" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_archiver_id_fkey" FOREIGN KEY ("archiver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
