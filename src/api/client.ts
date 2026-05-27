const  API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export async function getCollection(){
    const response = await fetch(`${API_BASE_URL}/items`)
    if(!response.ok){
        throw new Error("Failed to fetch collection")
    }
    return response.json()

}