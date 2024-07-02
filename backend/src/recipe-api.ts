import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
    if (!apiKey) {
        throw new Error("API Key not found");
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

    const queryParams = {
        apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString(),
    };
    url.search = new URLSearchParams(queryParams).toString();

    console.log(`Fetching URL: ${url.toString()}`);

    try {
        const searchResponse = await fetch(url.toString());
        if (!searchResponse.ok) {
            throw new Error(`Failed to fetch recipes: ${searchResponse.statusText}`);
        }
        const resultsJson = await searchResponse.json();
        console.log(`Response: ${JSON.stringify(resultsJson)}`);
        return resultsJson;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw new Error("Failed to fetch recipes");
    }
};     


export const getRecipeSummary = async (recipeId: string) =>{
    if (!apiKey) {
        throw new Error("API Key not found");
    } 
    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`);

    const params = {
        apiKey: apiKey
    }
    url.search = new URLSearchParams(params).toString()

    const response = await fetch(url);
    const json = await response.json();

    return json;
}