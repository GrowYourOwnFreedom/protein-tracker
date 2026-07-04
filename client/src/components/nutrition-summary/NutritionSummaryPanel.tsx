import SummaryCard from "@/components/nutrition-summary/SummaryCard";
import TargetCard from "@/components/nutrition-summary/TargetCard";
import Panel from "@/components/app/Panel";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FoodLogEntry, Targets } from "@/types";
import React, { useEffect, useState } from "react";

export type NutritionSummaryPanelProps = {
    foodLogEntries: FoodLogEntry[];
    calorieLimit: number;
    onCalorieLimitChange: (newCalorieLimit: number) => void;
    proteinTarget: number;
    onProteinTargetChange: (newProteinTarget: number) => void;
    selectedDate: string;
    targets: Targets;

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
    targets,
}: NutritionSummaryPanelProps) {
    const [proteinError, setProteinError] = useState<string>("");
    const [calorieError, setCalorieError] = useState<string>("");
    const [draftCalorieLimit, setDraftCalorieLimit] = useState<string>("");
    const [draftProteinTarget, setDraftProteinTarget] = useState<string>("");

    useEffect(() => {
        if (!targets) return;

        setDraftCalorieLimit(String(targets.calorieLimit));
        setDraftProteinTarget(String(targets.proteinTarget));
    },[]);

    type NutritionTotals = {
        weight: number;
        calories: number;
        protein: number;
    };

    function buildNutritionTotalsObject(
        foodLogEntries: FoodLogEntry[],
    ): NutritionTotals {
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

        return totals;
    }

    const { weight, calories, protein } =
        buildNutritionTotalsObject(foodLogEntries);

    function handleUdateProteinTarget(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const proteinNumber = Number(event.target.value);
        if (Number.isNaN(proteinNumber)) {
            setProteinError("please enter a valid number");
            return;
        } else {
            setDraftProteinTarget(event.target.value);
            setProteinError("");
        }
    }

    function handleUdateCalorieLimit(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const calorieNumber = Number(event.target.value);
        if (Number.isNaN(calorieNumber)) {
            setCalorieError("please enter a valid number");
            return;
        } else {
            setDraftCalorieLimit(event.target.value);
            setCalorieError("");
        }
    }
    function saveProteinTarget() {
        onProteinTargetChange(Number(draftProteinTarget));
    }
    function saveCalorieLimit() {
        onCalorieLimitChange(Number(draftCalorieLimit));
    }

    return (
        <Panel title="Nutrition Summary" className={className}>
            <p className="text-center">Food Eaten: {weight.toFixed(0)} g</p>
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="calorie-limit">
                            Calorie Limit:
                        </FieldLabel>
                        <Input
                            id="calorie-limit"
                            value={draftCalorieLimit}
                            onChange={handleUdateCalorieLimit}
                            onBlur={saveCalorieLimit}
                        />
                        {calorieError && (
                            <FieldError>{calorieError}</FieldError>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="protein-target">
                            Protein Target:
                        </FieldLabel>
                        <Input
                            id="protein-target"
                            value={draftProteinTarget}
                            onChange={handleUdateProteinTarget}
                            onBlur={saveProteinTarget}
                        />
                        {proteinError && (
                            <FieldError>{proteinError}</FieldError>
                        )}
                    </Field>
                </div>
            </FieldGroup>
            <div className="flex flex-1 flex-col gap-3 p-5 items-center bg-muted/40 overflow-y-auto shadow-[inset_0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 rounded-xl">
                <TargetCard
                    title={"Calories"}
                    current={calories}
                    target={calorieLimit}
                    unit={"kcal"}
                    type={"limit"}
                />
                <TargetCard
                    title={"Protein"}
                    current={protein}
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
