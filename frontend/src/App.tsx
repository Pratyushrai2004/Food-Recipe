import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";

type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setfavouriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavouriteRecipe = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipe();
        setfavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavouriteRecipe();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent the form from submitting the default way
    try {
      const data = await api.searchRecipes(searchTerm, 1);
      setRecipes(data.results);
      pageNumber.current = 1;
    } catch (e) {
      console.log(e);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  };
  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      console.log("Adding favorite recipe:", recipe);
      await api.addFavouriteRecipe(recipe);
      setfavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.error("Error adding favorite recipe:", error);
    }
  };

  const removeFavouriteRecipe = async(recipe: Recipe)=>{
    try {
      await api.removeFavouriteRecipe(recipe);
      const updatedRecipe = favouriteRecipes.filter(
        (favRecipe)=>recipe.id! == favRecipe.id
      );
      setfavouriteRecipes(updatedRecipe)
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favourites")}>Favourites</h1>
      </div>
      {selectedTab === "search" && (
        <>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              required
              placeholder="Enter a search term... "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>

          {recipes.map((recipe) => {
            const isFavourite = favouriteRecipes.some(
              (favRecipe) => recipe.id === favRecipe.id
            );
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onFavouriteButtonClick={isFavourite ? removeFavouriteRecipe : addFavouriteRecipe}
                isFavourite={isFavourite}
              />
            );
          })}

          {recipes.length > 0 && (
            <button className="view-more" onClick={handleViewMoreClick}>
              View More
            </button>
          )}
        </>
      )}

      {selectedTab === "favourites" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      )}
    </div>
  );
};


export default App;
