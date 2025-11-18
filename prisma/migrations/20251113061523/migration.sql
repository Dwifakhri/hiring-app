/*
  Warnings:

  - A unique constraint covering the columns `[job_name,company,location,job_type]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `job_type` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TypeJob" AS ENUM ('full_time', 'part_time', 'freelance', 'internship');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "job_type",
ADD COLUMN     "job_type" "TypeJob" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_job_name_company_location_job_type_key" ON "Job"("job_name", "company", "location", "job_type");
