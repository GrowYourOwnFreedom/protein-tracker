import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import { FoodEntryCardProps } from "@/types";

function EntryCard({
    entry,
    calorieLimit,
    proteinTarget,
    onDeleteEntryClick,
    index,
}:FoodEntryCardProps) {
    const { weight, calories, protein, name } = entry;
    const percentOfCalorieLimit = (entry.calories / calorieLimit) * 100 || 0;
    const percentOfProteinTarget = (entry.protein / proteinTarget) * 100 || 0;
    return (
        <Card className="w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0">
            <CardHeader>
                <CardTitle>
                    <div className="flex gap-3">
                        <p>{name}</p>
                        <p>{weight}g</p>
                    </div>
                </CardTitle>
                <CardAction>
                    <button
                        className="delete-entry-button"
                        onClick={() => {
                            onDeleteEntryClick(index);
                        }}
                    >
                        x
                    </button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>
                    Energy: {calories.toFixed(0)}kcal (
                    {percentOfCalorieLimit.toFixed(1)}%)
                </p>
                <p>
                    Protein: {protein.toFixed(1)}g (
                    {percentOfProteinTarget.toFixed(1)}%)
                </p>
            </CardContent>
        </Card>
    );
}
export default EntryCard;
