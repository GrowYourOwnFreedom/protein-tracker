/*
  Warnings:

  - Changed the type of `type` on the `FoodItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FoodItemType" AS ENUM ('simple', 'composite');

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "type",
ADD COLUMN     "type" "FoodItemType" NOT NULL;
