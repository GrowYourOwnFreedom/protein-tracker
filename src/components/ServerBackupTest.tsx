import { getAppDataBackup, getServerHealth, saveAppDataBackup } from "@/api/client";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import downloadJsonBackup from "@/lib/downloadJsonBackup";
import getBackupsummary from "@/lib/getBackupSummary";
import { getToday } from "@/lib/getToday";
import { collectAppDataBackup } from "@/lib/storageCrudHelpers";
import { BackupSummary, HealthResponse } from "@/types";
import { useState } from "react";

type BackupComparison = {
    backupComparison: {
        calorieLimit: string;
        proteinTarget: string;
        entries: string;
        ingredients: string;
        meals: string;
        exactlyEqual: boolean;
    };
};

export default function ServerBackupTest() {
    const [error, setError] = useState("");
    const [backupComparison, setBackupComparison] = useState<BackupComparison | null>(null);
    const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null)

    async function handleSaveBackup(): Promise<BackupComparison> {
        try {
            const localData = collectAppDataBackup();
            const backup = await saveAppDataBackup(localData);
            const serverBackup = await getAppDataBackup();

            const localSummary: BackupSummary = getBackupsummary(localData);
            const serverSummary: BackupSummary = getBackupsummary(serverBackup);
            const exactlyEqual =
                JSON.stringify(localData) === JSON.stringify(serverBackup);

            const comparison = {
                backupComparison: {
                    entries: `local ${localSummary.entries} / server ${serverSummary.entries}`,
                    ingredients: `local ${localSummary.ingredients} / server ${serverSummary.ingredients}`,
                    meals: `local ${localSummary.meals} / server ${serverSummary.meals}`,
                    proteinTarget: `local ${localSummary.proteinTarget} / server ${serverSummary.proteinTarget}`,
                    calorieLimit: `local ${localSummary.calorieLimit} / server ${serverSummary.calorieLimit}`,
                    exactlyEqual,
                },
            };

            setBackupComparison(comparison)
            

            console.log(backup.message, comparison);
            return comparison;

            setError("");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong");
            }
        }
    }

    async function handleGetBackup() {
        try {
            const savedBackup = await getAppDataBackup();
            console.log(savedBackup);
            setError("");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong");
            }
        }
    }

    function handleDownloadBackup() {
        const localData = collectAppDataBackup();
        const date = getToday();
        downloadJsonBackup(localData, `proteinTrackerLocalData_${date}.json`);
    }

    async function handleHealthClick() {
        const healthStatus = await getServerHealth()
        setHealthStatus(healthStatus)
    }
    const health = healthStatus?.status === "ok" ? "ok" : ""

    return (
        <Panel title="Server Backup Test">
            {error && <p>{error}</p>}
            <div className="grid grid-cols-2 gap-4" >

            <Button
                variant="outline"
                className="rounded-full"
                onClick={handleSaveBackup}
            >
                Save backup
            </Button>
            <Button
                variant="outline"
                className="rounded-full"
                onClick={handleGetBackup}
            >
                Get backup
            </Button>
            <Button
                variant="outline"
                className="rounded-full"
                onClick={handleDownloadBackup}
                >
                Download backup
            </Button>
            <Button variant="outline" className="rounded-full " onClick={handleHealthClick}>Server health {health}</Button>
            </div>
            {backupComparison && 
            <pre className="whitespace-pre-wrap wrap-break-word text-sm">{JSON.stringify(backupComparison,null,2)}</pre>
        }
        </Panel>
    );
}
