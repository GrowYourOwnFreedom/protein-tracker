import "dotenv/config";
import { prisma } from "@/db/prisma.js";

const result = await prisma.foodItem.updateMany({
    where: {
        userId: "ded-user",
    },
    data: { userId: "dev-user" },
});

console.log(`Updated food items: ${result.count}`);
await prisma.$disconnect()

