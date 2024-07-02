import { FormEvent, useRef, useState } from "react";
import "./App.css";
import * as api from './api';
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>(" ");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);


  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent the form from submitting the default way
    try {
      const data = await api.searchRecipes(searchTerm, 1);
      setRecipes(data.results);
      pageNumber.current = 1 
    } catch (e) {
      console.log(e);
    }
  };

  const handleViewMoreClick = async () =>{
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextPage
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          required
          placeholder = 'Enter a search term... '
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {recipes.map((recipe) => (
        <RecipeCard recipe = {recipe}/>
      ))}

      <button className="view-more" onClick={handleViewMoreClick}>
        View More 
      </button>
    </div>
  );
};

export default App;
