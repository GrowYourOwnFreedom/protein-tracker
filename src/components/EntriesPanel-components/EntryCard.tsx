import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FoodEntryCardProps } from "@/types";

function EntryCard({
    entry,
    calorieLimit,
    proteinTarget,
    onDeleteEntry: deleteEntry,
    className
}: FoodEntryCardProps) {
    const { weight, calories, protein, name, foodEntryId } = entry;
    const percentOfCalorieLimit =
        calorieLimit > 0 ? (calories / calorieLimit) * 100 : 0;
    const percentOfProteinTarget =
        proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0;
    return (
        <Card className={cn("w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0",className)}>
            <CardHeader>
                <CardTitle>
                    <div className="flex gap-3">
                        <p>{name}</p>
                        <p>{weight}g</p>
                    </div>
                </CardTitle>
                <CardAction>
                    <Button
                        aria-label={`Delete ${name}`}
                        className="rounded-full"
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            deleteEntry(foodEntryId);
                        }}
                    >
                        X
                    </Button>
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
