/*
  Warnings:

  - You are about to drop the column `updated_at` on the `ProfileConfiguration` table. All the data in the column will be lost.
  - The `full_name` column on the `ProfileConfiguration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `email` column on the `ProfileConfiguration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `photo_profile` column on the `ProfileConfiguration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `gender` to the `ProfileConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domicile` to the `ProfileConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `ProfileConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `ProfileConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `ProfileConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldRequirement" AS ENUM ('mandatory', 'optional', 'off');

-- AlterTable
ALTER TABLE "ProfileConfiguration" DROP COLUMN "updated_at",
DROP COLUMN "full_name",
ADD COLUMN     "full_name" "FieldRequirement" NOT NULL DEFAULT 'mandatory',
DROP COLUMN "email",
ADD COLUMN     "email" "FieldRequirement" NOT NULL DEFAULT 'mandatory',
DROP COLUMN "photo_profile",
ADD COLUMN     "photo_profile" "FieldRequirement" NOT NULL DEFAULT 'mandatory',
DROP COLUMN "gender",
ADD COLUMN     "gender" "FieldRequirement" NOT NULL,
DROP COLUMN "domicile",
ADD COLUMN     "domicile" "FieldRequirement" NOT NULL,
DROP COLUMN "phone",
ADD COLUMN     "phone" "FieldRequirement" NOT NULL,
DROP COLUMN "linkedin",
ADD COLUMN     "linkedin" "FieldRequirement" NOT NULL,
DROP COLUMN "birth",
ADD COLUMN     "birth" "FieldRequirement" NOT NULL;
