-- AlterTable
ALTER TABLE "role_on_user" ADD COLUMN     "unassignedAt" TIMESTAMP(3),
ADD COLUMN     "unassignedBy" TEXT;

-- AddForeignKey
ALTER TABLE "role_on_user" ADD CONSTRAINT "role_on_user_unassignedBy_fkey" FOREIGN KEY ("unassignedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
