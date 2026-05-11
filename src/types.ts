import { Progress as ProgressPrimitive } from "radix-ui";
import { ReactNode } from "react";

export type Ingredient = {
    ingredientId: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId: string;
    createdAt: string;
    ingredientCategory: string;
};

export type OldIngredient = {
    ingredientId?: string;
    id?: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId?: string;
    createdAt?: string;
    ingredientCategory?: string;
};

// Later: add id and ingredientId when delete/edit/date grouping needs it.
export type FoodEntry = {
    name: string;
    weight: number;
    protein: number;
    calories: number;
    foodEntryId: string;
    userId: string;
    createdAt: string;
};

export type User = {
    userId: string;
    name: string;
};

export type FoodEntryCardProps = {
    entry: FoodEntry;
    calorieLimit: number;
    proteinTarget: number;
    onDeleteEntryClick: (index: number) => void;
    index: number;
};
export type TargetCardProps = {
    title: string;
    current: number;
    target: number;
    unit: string;
    type: string;
};
export type SummaryCardProps = {
    currentCaloriesTotal: number;
    currentProteinTotal: number;
    proteinTarget: number;
    calorieLimit: number;
};

export type TodaysEntriesProps = {
    entries:FoodEntry[];
    deleteEntry:(updatedEntries: FoodEntry[]) => void;
    deleteAllEntries:()=>void;
    calorieLimit:number;
    proteinTarget:number;
    className:string;
}

export type TotalsPanelProps = {
    entries:FoodEntry[];
    calorieLimit:number;
    onCalorieLimitChange:(newCalorieLimit: number)=> void;
    proteinTarget:number;
    onProteinTargetChange:(newPoteinLimit: number)=> void;
    className:string;
}
export type PanelProps = { 
    title:string;
     children:ReactNode;
      className:string; }