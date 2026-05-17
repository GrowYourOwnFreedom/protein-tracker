import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MealSelectFieldProps } from "@/types";

export default function MealSelectField({meals, selectedMealId, onChange }:MealSelectFieldProps) {
    return (
         <Field>
                        <FieldLabel>Select Meal:</FieldLabel>
                        <Select
                            name="select-meal-id"
                            value={selectedMealId}
                            onValueChange={onChange}
                        >
                            <SelectTrigger className="bg-muted/40 shadow-inner/10">
                                <SelectValue placeholder="choose a meal" />
                            </SelectTrigger>
                            <SelectContent>
                                {meals &&
                                    meals.map((meal) => {
                                        return (
                                            <SelectItem
                                                value={meal.mealId}
                                                key={meal.mealId}
                                            >
                                                {meal.name}
                                            </SelectItem>
                                        );
                                    })}
                            </SelectContent>
                        </Select>
                    </Field>
    )
}
