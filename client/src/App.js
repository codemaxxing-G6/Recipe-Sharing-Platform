import React, { useState, useEffect } from 'react';
import './App.css';
import headerImage from './assets/header.png';
import UpdateRecipe from './UpdateRecipe';
import AddRecipe from './AddRecipe';

function getRandomColor() {
  const colors = ['#D6D46D', '#F4DFB6', '#DE8F5F', '#9A4444'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [recipeColors, setRecipeColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/recipes');
      const data = await response.json();
      setRecipes(data);
      setRecipeColors(data.map(() => getRandomColor()));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle active state
  };

  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe object for editing
  };

  const handleDeleteClick = async (recipeId) => {
    try {
      await fetch(`/recipes/${recipeId}`, {
        method: 'DELETE',
      });
      fetchRecipes(); // Refresh recipes after deletion
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleAddRecipeClick = () => {
    setShowAddForm(true); // Show the AddRecipe form
  };

  const handleAddComplete = () => {
    setShowAddForm(false); // Hide the form after adding a new recipe
    fetchRecipes(); // Refresh recipes to show the new recipe
  };

  const handleUpdateComplete = () => {
    setSelectedRecipe(null); // Close the UpdateRecipe form after update
    fetchRecipes(); // Refresh recipes to show updated data
  };

  const handleLoginClick = () => {
    setShowLoginPage(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterPage(true);
  };

  const handleReturnToMain = () => {
    setShowLoginPage(false);
    setShowRegisterPage(false);
  };

  const handleLoginSubmit = () => {
    //logica login aici
    handleReturnToMain();
  };

  const handleRegisterSubmit = () => {
    //logica register aici
    handleReturnToMain();
  };

  return (
    <div className="App">
      <header className="header" style={{ backgroundImage: `url(${headerImage})` }}>
        <h1 className="header-title">Welcome to Birou's Cuisine</h1>
        {!showLoginPage && !showRegisterPage && (
          <div className="auth-buttons">
            <button className="add-button" onClick={handleLoginClick}>Login</button>
            <button className="add-button" onClick={handleRegisterClick}>Register</button>
          </div>
        )}
      </header>

      {showLoginPage ? (
        <div className="login-page">
          <form className="form">
            <h2>Login</h2>
            <input type="text" placeholder="Username" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="button" className="add-button" onClick={handleLoginSubmit}>Login</button>
            <button className="add-button" onClick={handleReturnToMain}>Return to Main Page</button>
          </form>
        </div>
      ) : showRegisterPage ? (
        <div className="register-page">
          <form className="form">
            <h2>Register</h2>
            <input type="text" placeholder="Username" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="button" className="add-button" onClick={handleRegisterSubmit}>Register</button>
            <button className="add-button" onClick={handleReturnToMain}>Return to Main Page</button>
          </form>
        </div>
      ) : showAddForm ? (
        <AddRecipe onAdd={handleAddComplete} />
      ) : selectedRecipe ? (
        <UpdateRecipe recipe={selectedRecipe} onUpdate={handleUpdateComplete} />
      ) : (
        <div>
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
            <button className="add-button" onClick={handleAddRecipeClick}>Add Recipe</button>
          </div>
          <div className="recipes">
            {recipes.map((recipe, index) => (
              <div
                key={recipe._id}
                className="recipe-card"
                style={{ backgroundColor: recipeColors[index] }}
                onClick={() => handleCardClick(index)}
              >
                <h2>{recipe.title}</h2>
                <div className="recipe-info">
                  <p><strong>Ingredients: </strong>{Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
                  <p><strong>Instructions: </strong>{recipe.instructions}</p>
                  <p><strong>Nutritional facts: </strong>{recipe.nutritionalFacts}</p>
                </div>

                {activeIndex === index && (
                  <div className="card-buttons">
                    <button onClick={() => handleEditClick(recipe)}>Edit</button>
                    <button onClick={() => handleDeleteClick(recipe._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="chatgpt-popup" onClick={() => alert('Chat with us!')}>
        💬
      </div>
    </div>
  );
}

export default App;
