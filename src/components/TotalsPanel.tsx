import SummaryCard from "@/components/totalsPanel/SummaryCard";
import TargetCard from "@/components/totalsPanel/TargetCard";
import Panel from "@/components/app/Panel";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TotalsPanelProps } from "@/types";

function TotalsPanel({
    entries,
    calorieLimit,
    onCalorieLimitChange,
    proteinTarget,
    onProteinTargetChange,
    selectedDate,
    className,
}:TotalsPanelProps) {


    const totals = {
        weight: 0,
        calories: 0,
        protein: 0,
    };

    entries.forEach((entry) => {
        totals.calories = totals.calories + entry.calories;
        totals.protein = totals.protein + entry.protein;
        totals.weight = totals.weight + entry.weight;
    });

    const { weight, calories, protein } = totals;

    return (
        <Panel title="Totals" className={className}>
            <p className="text-center">Food Eaten: {weight.toFixed(0)} g</p>
            <div className="flex p-6 gap-4 shrink-0 items-center">
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="calorie-limit">
                                Calorie Limit:
                            </FieldLabel>
                            <Input
                                id="calorie-limit"
                                value={calorieLimit}
                                onChange={(e) =>
                                    onCalorieLimitChange(Number(e.target.value))
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="protein-target">
                                Protein Target:
                            </FieldLabel>
                            <Input
                                id="protein-target"
                                value={proteinTarget}
                                onChange={(e) =>
                                    onProteinTargetChange(Number(e.target.value))
                                }
                            />
                        </Field>
                    </div>
                </FieldGroup>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 items-center bg-muted/40 overflow-y-auto shadow-[inset_0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 rounded-xl">
                <TargetCard
                    title={"Calories"}
                    current={Number(calories.toFixed(0))}
                    target={calorieLimit}
                    unit={"kcal"}
                    type={"limit"}
                />
                <TargetCard
                    title={"Protein"}
                    current={Number(protein.toFixed(1))}
                    target={proteinTarget}
                    unit={"g"}
                    type={"goal"}
                />
                <SummaryCard
                    currentCaloriesTotal={calories}
                    currentProteinTotal={protein}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                />
            </div>
        </Panel>
    );
}

export default TotalsPanel;
