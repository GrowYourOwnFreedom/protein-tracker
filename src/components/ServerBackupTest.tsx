import { getAppDataBackup, saveAppDataBackup } from "@/api/client";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import { collectAppDataBackup } from "@/lib/storageCrudHelpers";
import { useState } from "react";

export default function ServerBackupTest() {
    const [error, setError] = useState("");
    async function handleSaveBackup() {
        const localData = collectAppDataBackup();
        const backup = await saveAppDataBackup(localData);
        console.log(backup.message);
        setError("")
    }

    async function handleGetBackup() {
        try {
            const savedBackup = await getAppDataBackup();
            console.log(savedBackup);
            setError("")
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong");
            }
        }
    }

    return (
        <Panel title="ServerBackupTest">
            {error && <p>{error}</p>}
            <Button className="rounded-lg" onClick={handleSaveBackup}>
                Save backup
            </Button>
            <Button onClick={handleGetBackup}>
                Get backup
            </Button>
        </Panel>
    );
}
