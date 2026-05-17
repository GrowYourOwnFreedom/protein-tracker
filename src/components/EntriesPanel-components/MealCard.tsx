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
    const [triggerMessage, setTriggerMessage] = useState(
        `Show ${entries.length} entries`,
    );
    const { name } = meal;

    const percentOfCalorieLimit =
        calorieLimit > 0 ? (calories / calorieLimit) * 100 : 0;
    const percentOfProteinTarget =
        proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0;

    function handleOpenChange(open) {
        if (!open) {
            console.log("closed");

            setTriggerMessage(`Show ${entries.length} entries`);
            setCollapsibleOpen(open);
            return;
        }
        console.log("open");
        setTriggerMessage("Hide entries");

        setCollapsibleOpen(open);
    }
    return (
        <Card className="w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0">
            <Collapsible open={collapsibleOpen} onOpenChange={handleOpenChange}>
                <CardHeader>
                    <CardTitle>
                        <div className="flex gap-3">
                            <p>{name}</p>
                            <p>{weight}g</p>
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
                        Energy: {calories.toFixed(0)}kcal (
                        {percentOfCalorieLimit.toFixed(1)}%)
                    </p>
                    <p>
                        Protein: {protein.toFixed(1)}g (
                        {percentOfProteinTarget.toFixed(1)}%)
                    </p>
                    <CollapsibleContent className=" mt-4 flex flex-col gap-y-3 pl-3">
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
