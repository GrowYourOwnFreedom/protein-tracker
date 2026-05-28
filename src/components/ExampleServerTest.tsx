import {
    createItem,
    deleteItem,
    getCollection,
    updateItem,
} from "@/api/client";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ExampleItem } from "@/types";
import { useEffect, useState } from "react";

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

    async function handleSubmit(event: React.SubmitEvent) {
        event.preventDefault();
        try {
            const createdItem = await createItem(inputValue);
            setItems((currentItems) => [...currentItems, createdItem]);
            setInputValue("");
            setErrorMessage("");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Could not create an item");
            }
        }
    }

    async function handleDelete(id: string): Promise<void> {
        try {
            const deletedItem = await deleteItem(id);
            console.log(deletedItem);
            function updateItemState(currentItems: ExampleItem[]) {
                return currentItems.filter((item: ExampleItem) => {
                    return item.id !== id;
                });
            }
            setItems(updateItemState);
            setErrorMessage("");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Something went wrong");
            }
        }
    }

    async function handleUpdate(id: string): Promise<void> {
        try {
            const updatedItem = await updateItem(id, "updated");
            console.log(updatedItem);

            function updateItemState(currentItems: ExampleItem[]) {
                const updatedItems = currentItems.map((item) => {
                    if (item.id === id) {
                        return updatedItem;
                    }
                    return item;
                });
                return updatedItems;
            }
            setItems(updateItemState);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Something went wrong");
            }
        }
    }

    return (
        <Panel title="Server test ui">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {errorMessage && <p>{errorMessage}</p>}

                    <form onSubmit={handleSubmit}>
                        <Field>
                            <Input
                                value={inputValue}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => setInputValue(event.target.value)}
                            />
                            <Button
                                disabled={inputValue.trim() === ""}
                                className="rounded-full"
                                type="submit"
                            >
                                submit post
                            </Button>
                        </Field>
                    </form>
                    <ul className="flex flex-col items-center">
                        {items.map((item) => (
                            <Card
                                key={item.id}
                                size="sm"
                                className="w-full bg-card ring-1 ring-foreground/10 max-w-xs rounded-lg gap-6 shadow-sm shrink-0"
                            >
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardAction>
                                        <Button
                                            type="button"
                                            className="rounded-lg"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            delete
                                        </Button>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className="rounded-lg"
                                        type="button"
                                        onClick={() => handleUpdate(item.id)}
                                    >
                                        Update
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </ul>
                </>
            )}
        </Panel>
    );
}
