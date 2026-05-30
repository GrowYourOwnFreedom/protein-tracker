import Panel from "@/components/app/Panel";
import { Input } from "@/components/ui/input";
import { isAppDataBackup } from "@/lib/appValidationHelpers";
import { useState } from "react";



export default function DevBackupRestore() {
  const [message, setMessage] = useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsedData: unknown = JSON.parse(text);

      if (!isAppDataBackup(parsedData)) {
        setMessage("That file does not look like a valid backup.");
        return;
      }

      localStorage.setItem(
        "proteinTrackerCalorieLimit",
        String(parsedData.calorieLimit),
      );

      localStorage.setItem(
        "proteinTrackerProteinTarget",
        String(parsedData.proteinTarget),
      );

      localStorage.setItem(
        "proteinTrackerEntries",
        JSON.stringify(parsedData.entries),
      );

      localStorage.setItem(
        "proteinTrackerIngredients",
        JSON.stringify(parsedData.ingredients),
      );

      localStorage.setItem(
        "proteinTrackerMeals",
        JSON.stringify(parsedData.meals),
      );

      localStorage.removeItem("dataVersion");

      setMessage(
        `Backup loaded: ${parsedData.entries.length} entries, ${parsedData.ingredients.length} food items, ${parsedData.meals.length} meals. Refreshing...`,
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Could not read this backup file.");
    }
  }

  return (
        <Panel title="Dev Backup Restore">

      <p>
        Choose a backup JSON file. This will replace local dev storage and then
        reload the app.
      </p>

      <Input placeholder="choose file ..." type="file" accept="application/json,.json" onChange={handleFileChange} />

      {message && <p>{message}</p>}
        </Panel>
  );
}