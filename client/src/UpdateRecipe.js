import React, { useState } from 'react';
import './UpdateRecipe.css';
import './App.css';

function UpdateRecipe({ recipe, onUpdateSuccess }) {
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [nutritionalFacts, setNutritionalFacts] = useState(recipe.nutritionalFacts);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedRecipe = { ...recipe, title, ingredients, instructions, nutritionalFacts };

    try {
      const response = await fetch(`/recipes/${recipe._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
      });
      const data = await response.json();
      onUpdateSuccess(data);
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div className="update-recipe">
      <h2>Update Recipe</h2>
      <form onSubmit={handleUpdate} className="update-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Ingredients:
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </label>
        <label>
          Instructions:
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>
        <label>
          Nutritional Facts:
          <input
            type="text"
            value={nutritionalFacts}
            onChange={(e) => setNutritionalFacts(e.target.value)}
          />
        </label>
        <button type="submit" className="add-button">Save Changes</button>
      </form>
    </div>
  );
}

export default UpdateRecipe;
