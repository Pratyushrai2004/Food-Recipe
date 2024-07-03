import React from 'react';
import { Recipe } from "../types";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface Props {
  recipe: Recipe;
  isFavourite: boolean;
  onClick: () => void;
  onFavouriteButtonClick: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onClick, isFavourite, onFavouriteButtonClick }: Props) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-card-title">
        <span
          onClick={(event) => {
            event.stopPropagation();
            onFavouriteButtonClick(recipe);
          }}
        >
          {isFavourite ? (
            <AiFillHeart size={25} color="red" />
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </span>
      </div>
      <h3>{recipe.title}</h3>
    </div>
  );
};

export default RecipeCard;
