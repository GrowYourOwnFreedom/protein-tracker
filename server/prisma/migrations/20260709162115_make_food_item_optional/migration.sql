-- DropForeignKey
ALTER TABLE "FoodLogEntry" DROP CONSTRAINT "FoodLogEntry_foodItemId_fkey";

-- AlterTable
ALTER TABLE "FoodLogEntry" ALTER COLUMN "foodItemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodLogEntry" ADD CONSTRAINT "FoodLogEntry_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("foodItemId") ON DELETE SET NULL ON UPDATE CASCADE;
