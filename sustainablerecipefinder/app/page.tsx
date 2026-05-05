"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

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
              {r.image && <img src={r.image} width={150} />}

              <p>Match: {used}/{total}</p>

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
    </main>
  );
}