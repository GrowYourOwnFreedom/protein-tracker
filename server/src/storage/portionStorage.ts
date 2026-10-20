import { prisma } from "@/db/prisma.js";
import { HttpError } from "@/errors/HttpError.js";
import { mapPortionFromDb } from "@/helpers/storageHelpers.js";
import type { CreatePortionRequestBody, Portion } from "@/types.js";

type CreatePortionArgs = {
    userId: string;
    data: CreatePortionRequestBody;
};


export async function createPortion({
    data,
    userId,
}: CreatePortionArgs): Promise<Portion> {
    const foodItem = await prisma.foodItem.findUnique({
        where:{
            foodItemId:data.foodItemId,
            userId
        }
    })    
    if(!foodItem){
        throw new HttpError(400, "Food item not found")
    }
    const portion = await prisma.portion.create({
        data: {
            ...data,
            userId,
        },
    });

    return mapPortionFromDb(portion);
}
