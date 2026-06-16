import { AppDataBackup, BackupSummary } from "@/types";


export default function getBackupsummary(data: AppDataBackup): BackupSummary {
    return {
        calorieLimit: data.calorieLimit,
        proteinTarget: data.proteinTarget,
        entries: data.entries.length,
        ingredients: data.ingredients.length,
        meals: data.meals.length,
    };
}
