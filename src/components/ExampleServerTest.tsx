import { getCollection } from "@/api/client";
import { useEffect, useState } from "react";

type ExampleItem = {
    id: string;
    name: string;
};
export default function ExampleServerTest() {
    const [items, setItems] = useState<ExampleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadItems() {
            try {
                const data = await getCollection();
                setItems(data);
            } catch {
                setErrorMessage("Could not load data from server");
            } finally {
                setIsLoading(false);
            }
        }
        loadItems();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    const testFunction = () => ( <p></p>) 
    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}
