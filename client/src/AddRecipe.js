// AddRecipe.js
import React, { useState } from 'react';
import './AddRecipe.css';
import headerImage from './assets/header.png'; // Import the header image

function AddRecipe({ onAddSuccess }) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [nutritionalFacts, setNutritionalFacts] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newRecipe = { title, ingredients, instructions, nutritionalFacts };

    try {
      const response = await fetch('/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        onAddSuccess(); // Call onAddSuccess to hide the form and refresh recipes
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleClose = () => {
    onAddSuccess(); // Close the form and go back to the main page
  };

  return (
    <div className="add-recipe">
      {/* Header Section with Background Image */}
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="add-form">
        <table>
          <tbody>
            <tr>
              <td><label>Title:</label></td>
              <td><input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              /></td>
            </tr>
            <tr>
              <td><label>Ingredients:</label></td>
              <td><input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              /></td>
            </tr>
            <tr>
              <td><label>Instructions:</label></td>
              <td><textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              /></td>
            </tr>
            <tr>
              <td><label>Nutritional Facts:</label></td>
              <td><input
                type="text"
                value={nutritionalFacts}
                onChange={(e) => setNutritionalFacts(e.target.value)}
              /></td>
            </tr>
          </tbody>
        </table>

        <div className="buttons">
          <button type="submit" className="add-button">Add Recipe</button>
          <button type="button" className="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
