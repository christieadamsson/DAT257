"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [instructions, setInstructions] = useState<any>(null);

  function addIngredient() {
    if (!input.trim()) return;

    setIngredients([...ingredients, input.trim()]);
    setInput("");
  }

  // funktion för att rensa
  function clearSearch() {
    setIngredients([]); 
    setRecipes([]);     
  }

  async function searchRecipes() {
    const res = await fetch(
      `http://localhost:8000/recipes?ingredients=${ingredients.join(",")}`
    );

    const data = await res.json();
    setRecipes(data.results || []); 
  }

  async function openInstructions(recipe: any) {
    setSelectedRecipe(recipe);
    setShowPopup(true);
    setInstructions(null);
  
    const res = await fetch(
      `http://localhost:8000/recipes/${recipe.id}/instructions`
    );
  
    const data = await res.json();
    setInstructions(data);
  }

  function closePopup() {
    setShowPopup(false);
    setSelectedRecipe(null);
    setInstructions(null);
  }

  function renderInstructions() {
    if (!instructions) return <p>Loading instructions...</p>;
  
    if (typeof instructions === "string") {
      return <p>{instructions}</p>;
    }
  
    if (Array.isArray(instructions)) {
      return instructions.map((section: any, index: number) => (
        <div key={index}>
          {section.name && <h4>{section.name}</h4>}
  
          {section.steps ? (
            <ol>
              {section.steps.map((step: any) => (
                <li key={step.number}>{step.step}</li>
              ))}
            </ol>
          ) : (
            <p>No instructions found.</p>
          )}
        </div>
      ));
    }
  
    return <p>No instructions found.</p>;
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Recipe Finder</h1>

      {/* input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="ingredients"
      />
      <button onClick={addIngredient}>Add</button>

      {/* ingredient list */}
      <div>
        <p>Ingredients:</p>
        {ingredients.map((i, idx) => (
          <span key={idx} style={{ marginRight: 8 }}>
            {i}
          </span>
        ))}
      </div>

      {/* knapp för att rensa*/}
      <div style={{ marginTop: 10 }}>
        <button onClick={searchRecipes} style={{ marginRight: 10 }}>
          Search recipes
        </button>
        
        <button 
          onClick={clearSearch} 
          style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      {/* results */}
      <div>
        {recipes.map((r) => {
          const used = r.usedIngredientCount || 0;
          const missed = r.missedIngredientCount || 0;
          const total = used + missed;
          const missingIngredients = r.missedIngredients || [];

          return (
            <div key={r.id} style={{ marginBottom: 20 }}>
              <h3>{r.title}</h3>
              {r.image && (
                <img
                  src={r.image}
                  width={150}
                  onClick={() => openInstructions(r)}
                  style={{ cursor: "pointer" }}
                  alt={r.title}
                />
              )}

              <p>Matching ingredients at home: {used}/{total}</p>

              <p>Seasonal ingredients:</p>

                {r.seasonal_ingredients?.length > 0 ? (
                  <ul>
                    {r.seasonal_ingredients.map((ingredient: string, idx: number) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No seasonal ingredients</p>
                )}

              <p>
                Seasonal match: {Math.round((r.seasonal_match || 0) * 100)}%
              </p>

              <p>Missing ingredients to buy:</p>
              {missingIngredients.length > 0 ? (
                <ul>
                  {missingIngredients.map((ingredient: any) => (
                    <li key={ingredient.id}>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No missing ingredients</p>
              )}
            </div>
          );
        })}
      </div>
      {showPopup && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              width: "80%",
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <button onClick={closePopup} style={{ float: "right" }}>
              X
            </button>

            <h2>{selectedRecipe?.title}</h2>

            {renderInstructions()}
          </div>
        </div>
      )}
    </main>
  );
}