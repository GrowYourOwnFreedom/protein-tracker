import "./App.css";
import NutritionSummaryPanel from "@/components/nutrition-summary/NutritionSummaryPanel";
import { useState, useEffect } from "react";
import AddFoodLogEntryPanel from "@/components/food-log/AddFoodLogEntryPanel";
import {
    CreateFoodItemRequestBody,
    CreateFoodLogEntryRequestBody,
    FoodItem,
    FoodLogEntry,
    Meal,
    Targets,
    UpdateFoodItemRequestBody,
} from "@/types";
import FoodLogPanel from "@/components/food-log/FoodLogPanel";
import { getToday } from "@/lib/getToday";
import CreateCompositeFoodItemPanel from "@/components/food-items/CreateCompositeFoodItemPanel";
import { getTargets, updateTargets } from "@/api/targets";
import {
    deleteFoodItem,
    getFoodItems,
    patchFoodItem,
    postFoodItem,
} from "@/api/food-items";
import { getMeals, postMeal } from "@/api/meals";
import {
    deleteFoodLogEntry,
    getFoodLogEntries,
    postFoodLogEntry,
} from "@/api/food-log-entries";

function App() {
    const [startupStatus, setStartupStatus] = useState<
        "loading" | "ready" | "error"
    >("loading");
    const [foodLogEntries, setFoodLogEntries] = useState<FoodLogEntry[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(() => getToday());
    const [selectedMealId, setSelectedMealId] = useState<string>("");

    const [meals, setMeals] = useState<Meal[]>([]);

    const [targets, setTargets] = useState<Targets | null>(null);

    const proteinTarget = targets?.proteinTarget ?? 0;
    const calorieLimit = targets?.calorieLimit ?? 0;

    useEffect(() => {
        async function initialiseApp() {
            try {
                const fetchedFoodItems = await getFoodItems();
                const fetchedTargets = await getTargets();
                setTargets(fetchedTargets);
                setFoodItems(fetchedFoodItems);
                setStartupStatus("ready");
            } catch (error) {
                console.error(error);
                setStartupStatus("error");
            }
        }
        initialiseApp();
    }, []);

    useEffect(() => {
        const loadFoodLogEntries = async () => {
            if (startupStatus !== "ready") {
                return;
            }
            const foodLogEntriesToDisplay =
                await getFoodLogEntries(selectedDate);
            setFoodLogEntries(foodLogEntriesToDisplay);
        };
        loadFoodLogEntries();
    }, [selectedDate, startupStatus]);

    useEffect(() => {
        const loadMeals = async () => {
            if (startupStatus !== "ready") {
                return;
            }
            const mealsToDisplay = await getMeals(selectedDate);
            setMeals(mealsToDisplay);
        };
        loadMeals();
    }, [selectedDate, startupStatus]);

    async function addFoodItem(data: CreateFoodItemRequestBody) {
        const newFoodItem = await postFoodItem(data);

        setFoodItems((currFoodItems) => [...currFoodItems, newFoodItem]);
    }

    async function updateFoodItem(id: string, data: UpdateFoodItemRequestBody) {
        const updatedFoodItem = await patchFoodItem(id, data);
        setFoodItems((currFoodItems) =>
            currFoodItems.map((foodItem) =>
                foodItem.foodItemId === updatedFoodItem.foodItemId
                    ? updatedFoodItem
                    : foodItem,
            ),
        );
    }

    async function removeFoodItem(foodItemId: string): Promise<void> {
        const deletedFoodItem = await deleteFoodItem(foodItemId);

        if (deletedFoodItem) {
            setFoodItems((currFoodItems) =>
                currFoodItems.filter((item) => item.foodItemId !== foodItemId),
            );
        }
    }

    async function addFoodLogEntry(data: CreateFoodLogEntryRequestBody) {
        const newEntry = await postFoodLogEntry(data);
        setFoodLogEntries((currEntries) => [newEntry, ...currEntries]);
    }

    async function removeEntry(id: string) {
        const deletedEntry = await deleteFoodLogEntry(id);
        if (deletedEntry) {
            setFoodLogEntries((currEntries) =>
                currEntries.filter((entry) => entry.foodLogEntryId !== id),
            );
        }
    }

    async function updateCalorieLimit(calorieLimit: number) {
        const updatedTargets = await updateTargets({ calorieLimit });
        setTargets(updatedTargets);
    }
    async function updateProteinTarget(proteinTarget: number) {
        const updatedTargets = await updateTargets({ proteinTarget });
        setTargets(updatedTargets);
    }

    function updateSelectedDate(date: string): void {
        setSelectedDate(date);
        setSelectedMealId("");
    }
    function updateSelectedMealId(mealId: string): void {
        setSelectedMealId(mealId);
    }

    async function createMeal(data: Meal) {
        const newMeal = await postMeal(data);
        setMeals((currMeals) => [...currMeals, newMeal]);
    }

    if (startupStatus === "loading") {
        return <p>Loading ...</p>;
    }
    if (startupStatus === "error") {
        return <p>Something went wrong while loading the app</p>;
    }

    return (
        <div className="lg:h-screen lg:flex lg:flex-col">
            <header className="lg:shrink-0 p-4">
                <h1 className="text-3xl text-center font-bold">
                    Protein Calorie Tracker
                </h1>
            </header>
            <main className="grid grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_1.5fr_1fr]">
                <NutritionSummaryPanel
                    className="lg:h-auto lg:min-h-0 "
                    foodLogEntries={foodLogEntries}
                    calorieLimit={calorieLimit}
                    onCalorieLimitChange={updateCalorieLimit}
                    proteinTarget={proteinTarget}
                    onProteinTargetChange={updateProteinTarget}
                    selectedDate={selectedDate}
                    targets={targets}
                />
                <div className="space-y-4">
                    <CreateCompositeFoodItemPanel />
                    <AddFoodLogEntryPanel
                        className="h-fit"
                        foodItems={foodItems}
                        onAddFoodLogEntry={addFoodLogEntry}
                        onDeleteFoodItem={removeFoodItem}
                        selectedDate={selectedDate}
                        onEditFoodItem={updateFoodItem}
                        onCreateMeal={createMeal}
                        meals={meals}
                        onAddFoodItem={addFoodItem}
                        selectedMealId={selectedMealId}
                        setSelectedMealId={updateSelectedMealId}
                    />
                </div>
                <FoodLogPanel
                    className="lg:h-auto lg:min-h-0"
                    foodLogEntries={foodLogEntries}
                    onDeleteFoodLogEntry={removeEntry}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                    onSelectedDateChange={updateSelectedDate}
                    selectedDate={selectedDate}
                    meals={meals}
                />
            </main>
        </div>
    );
}

export default App;
