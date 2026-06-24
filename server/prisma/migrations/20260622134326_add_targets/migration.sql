-- CreateTable
CREATE TABLE "Targets" (
    "userId" TEXT NOT NULL,
    "proteinTarget" DOUBLE PRECISION NOT NULL,
    "calorieLimit" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Targets_pkey" PRIMARY KEY ("userId")
);
