import React, { useState, useEffect } from 'react';
import './App.css';
import headerImage from './assets/header.png';

function getRandomColor() {
  const colors = ['#D6D46D', '#F4DFB6', '#DE8F5F', '#9A4444'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(null); // Track the active card clicked
  const [chatVisible, setChatVisible] = useState(false); // For showing/hiding chat
  const [chatMessages, setChatMessages] = useState([]); // Store chat messages
  const [userMessage, setUserMessage] = useState(''); // Store user's message input

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle active state
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent empty messages

    // Add user's message to chat
    setChatMessages([...chatMessages, { sender: 'user', text: userMessage }]);

    try {
      const response = await fetch('/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      // Add AI's reply to chat
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: data.reply }
      ]);
      setUserMessage(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
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
        <button className="add-button">Add Recipe</button>
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
              <p><strong>Ingredients: </strong>{Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
              <p><strong>Instructions: </strong>{recipe.instructions}</p>
              <p><strong>Nutritional facts: </strong>{recipe.nutritionalFacts}</p>
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

      <div className="chatgpt-popup" onClick={toggleChat}>
        💬
      </div>

      {chatVisible && (
        <div className="chatgpt-container">
          <div className="chatgpt-header">Chat with ChefGPT</div>
          <div className="chatgpt-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === 'user' ? 'chatgpt-user' : 'chatgpt-ai'}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatgpt-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask something about cooking..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;