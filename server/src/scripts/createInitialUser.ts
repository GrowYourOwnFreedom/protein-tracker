import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/prisma.js";



const USER_ID = "other-user";
const EMAIL = process.env.INITIAL_USER_EMAIL;
const PASSWORD = process.env.INITIAL_USER_PASSWORD;

async function main() {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      "Missing INITIAL_USER_EMAIL or INITIAL_USER_PASSWORD environment variable",
    );
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: {
      userId: USER_ID,
    },
    update: {
      email: EMAIL,
      passwordHash,
    },
    create: {
      userId: USER_ID,
      email: EMAIL,
      passwordHash,
    },
  });

  console.log("Created/updated initial user:");
  console.log({
    userId: user.userId,
    email: user.email,
    createdAt: user.createdAt,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });