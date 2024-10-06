-- CreateTable
CREATE TABLE "auth_codes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" VARCHAR(6) NOT NULL,

    CONSTRAINT "auth_codes_pkey" PRIMARY KEY ("id")
);
