const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCollection() {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) {
        throw new Error("Failed to fetch collection");
    }
    return response.json();
}

export async function createItem(name: string) {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    const data =  await response.json()
    if(!response.ok) {        
        throw new Error(data.error ?? "Failed to create an item")
    }
    return data
}
