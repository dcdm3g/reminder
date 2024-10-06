/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `auth_codes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_codes_email_key" ON "auth_codes"("email");
