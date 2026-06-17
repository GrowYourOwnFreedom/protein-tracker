/*
  Warnings:

  - Changed the type of `weight` on the `FoodLogEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FoodLogEntry" DROP COLUMN "weight",
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;
