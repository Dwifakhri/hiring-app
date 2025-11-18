/*
  Warnings:

  - You are about to drop the column `created_at` on the `JobApplicationAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `field_key` on the `JobApplicationAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `field_value` on the `JobApplicationAnswer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `JobApplicationAnswer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `JobApplicationAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `JobApplicationAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo_profile` to the `JobApplicationAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplicationAnswer" DROP COLUMN "created_at",
DROP COLUMN "field_key",
DROP COLUMN "field_value",
ADD COLUMN     "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "birth" TIMESTAMP(3),
ADD COLUMN     "country" TEXT,
ADD COLUMN     "country_code" TEXT,
ADD COLUMN     "domicile" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "photo_profile" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JobApplicationAnswer_email_key" ON "JobApplicationAnswer"("email");
