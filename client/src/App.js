// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import headerImage from './assets/header.png';
import AddRecipe from './AddRecipe'; // Import the AddRecipe component

function getRandomColor() {
  const colors = ['#D6D46D', '#F4DFB6', '#DE8F5F', '#9A4444'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAddRecipeVisible, setIsAddRecipeVisible] = useState(false); // Manage visibility of AddRecipe

  // Function to fetch recipes
  const fetchRecipes = async () => {
    try {
      const response = await fetch('/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes(); // Initial fetch
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const showAddRecipe = () => {
    setIsAddRecipeVisible(true);
  };

  const hideAddRecipe = () => {
    setIsAddRecipeVisible(false);
    fetchRecipes(); // Refresh the recipes after closing the add recipe form
  };

  return (
    <div className="App">
      {isAddRecipeVisible ? (
        <AddRecipe onAddSuccess={hideAddRecipe} />
      ) : (
        <>
          <header className="header" style={{ backgroundImage: `url(${headerImage})` }}>
            <h1 className="header-title">Welcome to Recipe App</h1>
          </header>

          <div className="navbar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div className="add">
              <button className="add-button" onClick={showAddRecipe}>
                Add Recipe
              </button>
            </div>
          </div>

          <div className="recipes">
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-card"
                style={{ backgroundColor: getRandomColor() }}
                onClick={() => handleCardClick(index)}
              >
                <h2>{recipe.title}</h2>
                <div className="recipe-info">
                  <p>
                    <strong>Ingredients: </strong>
                    {Array.isArray(recipe.ingredients)
                      ? recipe.ingredients.join(', ')
                      : recipe.ingredients}
                  </p>
                  <p>
                    <strong>Instructions: </strong>
                    {recipe.instructions}
                  </p>
                  <p>
                    <strong>Nutritional facts: </strong>
                    {recipe.nutritionalFacts}
                  </p>
                </div>

                {activeIndex === index && (
                  <div className="card-buttons">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chatgpt-popup" onClick={() => alert('Chat with us!')}>
            💬
          </div>
        </>
      )}
    </div>
  );
}

export default App;
