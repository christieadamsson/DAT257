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
        placeholder="tomato"
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

      {/* search */}
      <button onClick={searchRecipes}>Search recipes</button>

      {/* results */}
      <div>
        {recipes.map((r) => (
          <div key={r.id}>
            <h3>{r.title}</h3>
            {r.image && <img src={r.image} width={150} />}
          </div>
        ))}
      </div>
    </main>
  );
}