import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/formatNumber";
import { cn } from "@/lib/utils";
import { FoodLogEntry } from "@/types";


 type FoodLogEntryCardProps = {
    entry: FoodLogEntry;
    calorieLimit: number;
    proteinTarget: number;
    onDeleteEntry: (foodLogEntryId: string) => void;
    className?: string;
    size?: "default" | "sm";
};

export default function FoodLogEntryCard({
    entry,
    calorieLimit,
    proteinTarget,
    onDeleteEntry: deleteEntry,
    className,
    size = "default",
}: FoodLogEntryCardProps) {
    const { weight, calories, protein, name, foodLogEntryId } = entry;
    const percentOfCalorieLimit =
        calorieLimit > 0 ? (calories / calorieLimit) * 100 : 0;
    const percentOfProteinTarget =
        proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0;
    return (
        <Card
            size={size}
            className={cn(
                "w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0",
                className,
            )}
        >
            <CardHeader>
                <CardTitle>
                    <div className="flex gap-3">
                        <p>{name}</p>
                        <p>{formatNumber(weight)}g</p>
                    </div>
                </CardTitle>
                <CardAction>
                    <Button
                        aria-label={`Delete ${name}`}
                        className="rounded-full"
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            deleteEntry(foodLogEntryId);
                        }}
                    >
                        X
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>
                    Energy: {formatNumber(calories)} kcal (
                    {formatNumber(percentOfCalorieLimit)}%)
                </p>
                <p>
                    Protein: {formatNumber(protein)}g (
                    {formatNumber(percentOfProteinTarget)}%)
                </p>
            </CardContent>
        </Card>
    );
}
