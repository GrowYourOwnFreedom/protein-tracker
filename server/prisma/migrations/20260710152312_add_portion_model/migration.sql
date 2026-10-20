-- CreateTable
CREATE TABLE "Portion" (
    "portionId" TEXT NOT NULL,
    "foodItemId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portion_pkey" PRIMARY KEY ("portionId")
);

-- AddForeignKey
ALTER TABLE "Portion" ADD CONSTRAINT "Portion_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("foodItemId") ON DELETE CASCADE ON UPDATE CASCADE;
