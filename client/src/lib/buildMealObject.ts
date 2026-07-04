import { CreateMealRequestBody } from "@/types";

type BuildMealObjectArgs = {
    date: string;
    name: string;
};

export default function buildMealObject({
    date,
    name,
}: BuildMealObjectArgs): CreateMealRequestBody {
    const newMeal: CreateMealRequestBody = {
        name: name.trim(),
        date,
    };
    return newMeal;
}
