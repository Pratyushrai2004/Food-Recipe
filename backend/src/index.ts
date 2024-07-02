import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as RecipeAPI from './recipe-api';
import {PrismaClient} from "@prisma/client"
const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/recipes/search", async (req, res) => {
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);
    try {
        const results = await RecipeAPI.searchRecipes(searchTerm, page);
        return res.json(results);
    } catch (error) {
        // Type guard to ensure error is of type Error
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Unknown error occurred" });
        }
    }
});

app.get("/api/recipes/:recipeId/summary",async(req, res)=>{
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId);
    return res.json(results);
})

app.post("/api/recipes/favourite", async(req, res)=>{
    const recipeId = req.body.recipeId;

    try {
        const favouriteRecipe = await prismaClient.favouriteRecipes.create({
            data: {recipeId:recipeId}
        });
        return res.status(201).json(favouriteRecipe)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Oops, something went wrong'})
    }
})

app.listen(5000, () => {
    console.log("Server running on localhost:5000");
});
