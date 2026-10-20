import type { Portion as DbPortion } from "@/generated/prisma/client.js";

export function mapPortionFromDb(portion: DbPortion) {
    return {
        ...portion,
        createdAt: portion.createdAt.toISOString(),
    };
}