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

export default function MealCard({
    meal: { name },
    entries,
    calories,
    protein,
    calorieLimit,
    proteinTarget,
    onDeleteEntry: deleteEntry,
}) {
    const percentOfCalorieLimit =
        calorieLimit > 0 ? (calories / calorieLimit) * 100 : 0;
    const percentOfProteinTarget =
        proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0;
    return (
        <Card className="w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0">
            <Collapsible className="group">
                <CardHeader>
                    <CardTitle>
                        <div className="flex gap-3">
                            <p>{name}</p>
                        </div>
                    </CardTitle>
                    <CardAction>
                        <CollapsibleTrigger asChild>
                            <Button className="rounded-md mx-auto">
                                {" "}
                                Entries
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
                    <CollapsibleContent>
                        {entries.map((entry) => {
                            return (
                                <EntryCard
                                className="group-data-[state=open]:bg-muted"
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
