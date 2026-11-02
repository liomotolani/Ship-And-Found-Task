-- CreateTable
CREATE TABLE "UsedVerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsedVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsedVerificationCode_email_usedAt_idx" ON "UsedVerificationCode"("email", "usedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UsedVerificationCode_email_codeHash_key" ON "UsedVerificationCode"("email", "codeHash");
