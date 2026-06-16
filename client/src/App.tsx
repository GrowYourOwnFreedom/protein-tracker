import "./App.css";
import NutritionSummaryPanel from "@/components/nutrition-summary/NutritionSummaryPanel";
import { useState, useEffect } from "react";
import AddFoodLogEntryPanel from "@/components/food-log/AddFoodLogEntryPanel";
import {
    getCurrentUser,
    createStoredFoodItem,
    fetchStoredFoodItems,
    updateStoredFoodItem,
    deleteStoredFoodItem,
    createStoredFoodLogEntry,
    fetchStoredFoodLogEntries,
    deleteStoredFoodLogEntry,
    createStoredMeal,
    fetchStoredMeals,
    fetchStoredCalorieLimit,
    updateStoredCalorieLimit,
    fetchStoredProteinTarget,
    updateStoredProteinTarget,
    getDataVersion,
    setDataVersion,
    runMigration,
} from "@/lib/storageCrudHelpers";
import { FoodItem, FoodLogEntry, Meal, User } from "@/types";
import FoodLogPanel from "@/components/food-log/FoodLogPanel";
import { getToday } from "@/lib/getToday";
import CreateCompositeFoodItemPanel from "@/components/food-items/CreateCompositeFoodItemPanel";
import ExampleServerTest from "@/components/ExampleServerTest";
import ServerBackupTest from "@/components/ServerBackupTest";
import DevBackupRestore from "@/components/DevBackupRestore";
import { DATA_VERSION, DEV_ENVIRONMENT } from "@/config/env";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [startupStatus, setStartupStatus] = useState<
        "loading" | "ready" | "error"
    >("loading");
    const [foodLogEntries, setFoodLogEntries] = useState<FoodLogEntry[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(() => getToday());
    const [calorieLimit, setCalorieLimit] = useState<number>(() =>
        fetchStoredCalorieLimit(),
    );
    const [meals, setMeals] = useState<Meal[]>([]);
    const [proteinTarget, setProteinTarget] = useState<number>(() =>
        fetchStoredProteinTarget(),
    );

    useEffect(() => {
        async function initialiseApp() {
            try {
                const currentUser = await getCurrentUser();
                if (!DATA_VERSION) {
                    throw new Error("VITE_DATA_VERSION is not set");
                }
                const storedDataVersion = getDataVersion();
                if (storedDataVersion !== DATA_VERSION) {
                    const savedFoodItems = fetchStoredFoodItems(
                        currentUser.userId,
                    );

                    const migration = runMigration(currentUser.userId);
                    if (migration) {
                        console.log("migration success");

                        setDataVersion(DATA_VERSION);
                    } else {
                        throw new Error("Migration failed");
                    }
                }
                const fetchedFoodItems = fetchStoredFoodItems(
                    currentUser.userId,
                );

                setFoodItems(fetchedFoodItems);
                setUser(currentUser);
                setStartupStatus("ready");
            } catch (error) {
                console.error(error);
                setStartupStatus("error");
            }
        }
        initialiseApp();
    }, []);

    useEffect(() => {
        if (startupStatus !== "ready") {
            return;
        }
        const foodLogEntriesToDisplay = fetchStoredFoodLogEntries(selectedDate);
        setFoodLogEntries(foodLogEntriesToDisplay);
    }, [selectedDate, startupStatus]);

    useEffect(() => {
        if (startupStatus !== "ready") {
            return;
        }
        const mealsToDisplay = fetchStoredMeals(selectedDate);
        setMeals(mealsToDisplay);
    }, [selectedDate, startupStatus]);

    useEffect(() => {
        if (startupStatus !== "ready") {
            return;
        }
        updateStoredCalorieLimit(calorieLimit);
    }, [calorieLimit, startupStatus]);

    useEffect(() => {
        if (startupStatus !== "ready") {
            return;
        }
        updateStoredProteinTarget(proteinTarget);
    }, [proteinTarget, startupStatus]);

    function addFoodItem(newFoodItem: FoodItem): void {
        const newFoodItems = [...foodItems, newFoodItem];
        setFoodItems(newFoodItems);
        createStoredFoodItem(newFoodItem);
    }

    function updateFoodItem(updatedFoodItem: FoodItem) {
        const updatedFoodItems = foodItems.map((foodItem) => {
            if (foodItem.foodItemId === updatedFoodItem.foodItemId) {
                return updatedFoodItem;
            }
            return foodItem;
        });

        setFoodItems(updatedFoodItems);
        updateStoredFoodItem(updatedFoodItem);
    }

    function deleteFoodItem(foodItemId: string): void {
        const updatedFoodItems = foodItems.filter((foodItem) => {
            return foodItem.foodItemId !== foodItemId;
        });
        setFoodItems(updatedFoodItems);
        deleteStoredFoodItem(foodItemId);
    }

    function addFoodLogEntry(newFoodLogEntry: FoodLogEntry): void {
        const newEntries = [newFoodLogEntry, ...foodLogEntries];
        setFoodLogEntries(newEntries);
        createStoredFoodLogEntry(newFoodLogEntry);
    }

    function deleteEntry(foodLogEntryId: string): void {
        const filteredEntries = foodLogEntries.filter((entry) => {
            return entry.foodLogEntryId !== foodLogEntryId;
        });
        setFoodLogEntries(filteredEntries);
        deleteStoredFoodLogEntry(foodLogEntryId);
    }

    function updateCalorieLimit(newCalorieLimit: number): void {
        setCalorieLimit(newCalorieLimit);
    }
    function updateProteinTarget(newProteinTarget: number): void {
        setProteinTarget(newProteinTarget);
    }

    function updateSelectedDate(date: string): void {
        setSelectedDate(date);
    }

    function createMeal(newMeal: Meal): void {
        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        createStoredMeal(newMeal);
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
                />
                <div className="space-y-4">
                    <CreateCompositeFoodItemPanel />
                    <AddFoodLogEntryPanel
                        className="h-fit"
                        foodItems={foodItems}
                        onAddFoodLogEntry={addFoodLogEntry}
                        onDeleteFoodItem={deleteFoodItem}
                        selectedDate={selectedDate}
                        onEditFoodItem={updateFoodItem}
                        onCreateMeal={createMeal}
                        meals={meals}
                        onAddFoodItem={addFoodItem}
                    />
                    {DEV_ENVIRONMENT && <ExampleServerTest/>}
                    
                    <ServerBackupTest />
                </div>
                <FoodLogPanel
                    className="lg:h-auto lg:min-h-0"
                    foodLogEntries={foodLogEntries}
                    onDeleteFoodLogEntry={deleteEntry}
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
