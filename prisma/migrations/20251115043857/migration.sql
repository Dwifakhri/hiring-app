-- CreateTable
CREATE TABLE "JobApplicationAnswer" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "field_key" TEXT NOT NULL,
    "field_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplicationAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobApplicationAnswer_application_id_idx" ON "JobApplicationAnswer"("application_id");

-- AddForeignKey
ALTER TABLE "JobApplicationAnswer" ADD CONSTRAINT "JobApplicationAnswer_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "JobApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
