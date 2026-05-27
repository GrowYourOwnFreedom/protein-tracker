import { createItem, getCollection } from "@/api/client";
import { useEffect, useState } from "react";

type ExampleItem = {
    id: string;
    name: string;
};
export default function ExampleServerTest() {
    const [items, setItems] = useState<ExampleItem[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

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

    async function handleSubmit(event: React.SubmitEvent) {
        event.preventDefault();
        try {
            const createdItem = await createItem(inputValue);
            setItems((currentItems) => [...currentItems, createdItem]);
            setInputValue("");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Could not create an item");
            }
        }
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <input
                    value={inputValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setInputValue(event.target.value)
                    }
                />
                <button type="submit">submit post</button>
            </form>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </section>
    );
}
