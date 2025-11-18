-- CreateEnum
CREATE TYPE "StatusJob" AS ENUM ('active', 'inactive', 'draft');

-- CreateTable
CREATE TABLE "Job" (
    "id" UUID NOT NULL,
    "department" TEXT NOT NULL,
    "status" "StatusJob" NOT NULL,
    "salary_min" INTEGER NOT NULL,
    "salary_max" INTEGER NOT NULL,
    "job_name" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "number_candidates" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profile_config_id" UUID NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileConfiguration" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo_profile" TEXT,
    "gender" TEXT,
    "domicile" TEXT,
    "phone" TEXT,
    "linkedin" TEXT,
    "birth" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_profile_config_id_key" ON "Job"("profile_config_id");

-- CreateIndex
CREATE INDEX "JobApplication_user_id_idx" ON "JobApplication"("user_id");

-- CreateIndex
CREATE INDEX "JobApplication_job_id_idx" ON "JobApplication"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_user_id_job_id_key" ON "JobApplication"("user_id", "job_id");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_profile_config_id_fkey" FOREIGN KEY ("profile_config_id") REFERENCES "ProfileConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
