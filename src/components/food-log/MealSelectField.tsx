import { Field, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Meal } from "@/types";


type MealSelectFieldProps = {
    meals: Meal[];
    selectedMealId: string;
    onChange: (mealId: string) => void;

    className?: string;
};

export default function MealSelectField({
    meals,
    selectedMealId,
    onChange,
}: MealSelectFieldProps) {
    function handleMealChange(value) {
        if (value === "none") {
            onChange("");
            return;
        }
        onChange(value);
    }

    return (
        <Field>
            <FieldLabel htmlFor="meal-select">Meal:</FieldLabel>
            <Select
                name="select-meal-id"
                value={selectedMealId}
                onValueChange={onChange}
            >
                <SelectTrigger
                    id="meal-select"
                    className="bg-muted/40 shadow-inner/10"
                >
                    <SelectValue placeholder="Choose a meal" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">No meal</SelectItem>
                    {meals.map((meal) => {
                        return (
                            <SelectItem value={meal.mealId} key={meal.mealId}>
                                {meal.name}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </Field>
    );
}
