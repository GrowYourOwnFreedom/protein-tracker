import EntryCard from "@/components/EntriesPanel-components/EntryCard";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatNumber } from "@/lib/formatNumber";
import { MealCardProps } from "@/types";
import { useState } from "react";

export default function MealCard({
    meal,
    entries,
    calories,
    protein,
    calorieLimit,
    proteinTarget,
    onDeleteEntry: deleteEntry,
    weight,
}: MealCardProps) {
    const [collapsibleOpen, setCollapsibleOpen] = useState(false);
    const { name } = meal;

    const percentOfCalorieLimit =
        calorieLimit > 0 ? (calories / calorieLimit) * 100 : 0;
    const percentOfProteinTarget =
        proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0;
    const triggerMessage = collapsibleOpen
        ? `Show ${entries.length} entries`
        : "Hide entries";

    
    return (
        <Card className="w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0">
            <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
                <CardHeader>
                    <CardTitle>
                        <div className="flex gap-3">
                            <p>{name}</p>
                            <p>{formatNumber(weight)}g</p>
                        </div>
                    </CardTitle>
                    <CardAction>
                        <CollapsibleTrigger asChild>
                            <Button className="rounded-md mx-auto">
                                {triggerMessage}
                            </Button>
                        </CollapsibleTrigger>
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
                    <CollapsibleContent className="mt-4 flex flex-col gap-y-3 pl-3">
                        {entries.map((entry) => {
                            return (
                                <EntryCard
                                    size="sm"
                                    className="bg-muted/40 shadow-none border-none"
                                    key={entry.foodEntryId}
                                    proteinTarget={proteinTarget}
                                    entry={entry}
                                    calorieLimit={calorieLimit}
                                    onDeleteEntry={deleteEntry}
                                />
                            );
                        })}
                    </CollapsibleContent>
                </CardContent>
            </Collapsible>
        </Card>
    );
}
