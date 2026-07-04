import {PrismaPg}  from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client.js";
import { DATABASE_URL } from "@/config/env.js";



if(!DATABASE_URL){
    throw new Error("DATABASE_URL id not set")
}
const adapter = new PrismaPg({
    connectionString:DATABASE_URL
})
export const prisma = new PrismaClient({adapter})