import SummaryCard from "@/components/NutritionSummaryPanel-components/SummaryCard";
import TargetCard from "@/components/NutritionSummaryPanel-components/TargetCard";
import Panel from "@/components/app/Panel";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FoodLogEntry } from "@/types";
import { useState } from "react";

export type NutritionSummaryPanelProps = {
    foodLogEntries: FoodLogEntry[];
    calorieLimit: number;
    onCalorieLimitChange: (newCalorieLimit: number) => void;
    proteinTarget: number;
    onProteinTargetChange: (newProteinTarget: number) => void;
    selectedDate: string;

    className?: string;
};

export default function NutritionSummaryPanel({
    foodLogEntries,
    calorieLimit,
    onCalorieLimitChange,
    proteinTarget,
    onProteinTargetChange,
    selectedDate,
    className,
}: NutritionSummaryPanelProps) {
    const [proteinError, setProteinError] = useState<string>("");
    const [calorieError, setCalorieError] = useState<string>("");
    const totals = {
        weight: 0,
        calories: 0,
        protein: 0,
    };

    foodLogEntries.forEach((foodLogEntry) => {
        totals.calories = totals.calories + foodLogEntry.calories;
        totals.protein = totals.protein + foodLogEntry.protein;
        totals.weight = totals.weight + foodLogEntry.weight;
    });

    const { weight, calories, protein } = totals;

    function handleUdateProteinTarget(event) {
        const proteinNumber = Number(event.target.value);
        if (Number.isNaN(proteinNumber)) {
            setProteinError("please enter a valid number");
            return;
        }else {

            onProteinTargetChange(proteinNumber) ;
            setProteinError("")
        }
    }
     function handleUdateCalorieLimit(event) {
        const calorieNumber = Number(event.target.value);
        if (Number.isNaN(calorieNumber)) {
            setCalorieError("please enter a valid number");
            return;
        }else{
            onCalorieLimitChange(calorieNumber) ;
            setCalorieError("")

        }
    }

    return (
        <Panel title="Totals" className={className}>
            <p className="text-center">Food Eaten: {weight.toFixed(0)} g</p>
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="calorie-limit">
                            Calorie Limit:
                        </FieldLabel>
                        <Input
                            id="calorie-limit"
                            value={calorieLimit}
                            onChange={handleUdateCalorieLimit}
                        />
                        {calorieError && <FieldError>{calorieError}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="protein-target">
                            Protein Target:
                        </FieldLabel>
                        <Input
                            id="protein-target"
                            value={proteinTarget}
                            onChange={handleUdateProteinTarget}
                        />
                        {proteinError && <FieldError>{proteinError}</FieldError>}
                    </Field>
                </div>
            </FieldGroup>
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

