import { prisma } from "@/db/prisma.js";
import type { Targets, UpdateTargetsRequestBody } from "@/types.js";
import type { Targets as DbTargets } from "@/generated/prisma/client.js";
import { defaults } from "@/config/defaults.js";
const { DEFAULT_PROTEIN_TARGET, DEFAULT_CALORIE_LIMIT } = defaults;

function mapTargetsFromDb(targets: DbTargets): Targets {
    return {
        ...targets,
        updatedAt: targets.updatedAt.toISOString(),
    };
}

export async function getOrCreateTargets(userId: string): Promise<Targets> {
    const targets = await prisma.targets.findFirst({
        where: {
            userId,
        },
    });

    if (!targets) {
        const targets = await prisma.targets.create({
            data: {
                proteinTarget: DEFAULT_PROTEIN_TARGET,
                calorieLimit: DEFAULT_CALORIE_LIMIT,
                userId,
            },
        });

        return mapTargetsFromDb(targets);
    } else {
        return mapTargetsFromDb(targets);
    }
}

export async function updateOrCreateTargets(
    userId: string,
    targets: UpdateTargetsRequestBody,
): Promise<Targets> {
    const { proteinTarget, calorieLimit } = targets
    const savedTargets = await prisma.targets.upsert({
        create: {
            proteinTarget: proteinTarget || DEFAULT_PROTEIN_TARGET,
            calorieLimit: calorieLimit || DEFAULT_CALORIE_LIMIT,
            userId,
        },
        update: { ...targets },
        where: {
            userId,
        },
    });
    return mapTargetsFromDb(savedTargets);
}
