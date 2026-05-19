"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [instructions, setInstructions] = useState<any>(null);
  const [recipeInfo, setRecipeInfo] = useState<any>(null);
  const [recipeInfoById, setRecipeInfoById] = useState<Record<number, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [dietFilters, setDietFilters] = useState({
    glutenFree: false,
    vegetarian: false,
    vegan: false,
    dairyFree: false,
  });
  const [wantWineSuggestion, setWantWineSuggestion] = useState(false);

  function addIngredient() {
    if (!input.trim()) return;

    setIngredients([...ingredients, input.trim()]);
    setInput("");
  }

  // funktion för att rensa
  function clearSearch() {
    setIngredients([]);
    setRecipes([]);
    setRecipeInfoById({});
    setDietFilters({
      glutenFree: false,
      vegetarian: false,
      vegan: false,
      dairyFree: false,
    });
    setWantWineSuggestion(false);
  }

  async function searchRecipes() {
    const res = await fetch(
      `http://localhost:8000/recipes?ingredients=${ingredients.join(",")}`
    );

    const data = await res.json();
    const recipeResults = data.results || [];
    setRecipes(recipeResults);

    const infoEntries = await Promise.all(
      recipeResults.map(async (recipe: any) => {
        try {
          const infoRes = await fetch(
            `http://localhost:8000/recipes/${recipe.id}/information`
          );
          const infoData = await infoRes.json();
          return [recipe.id, infoData];
        } catch (error) {
          console.error(`Could not fetch information for recipe ${recipe.id}`, error);
          return [recipe.id, null];
        }
      })
    );

    setRecipeInfoById(Object.fromEntries(infoEntries));
  }

  async function openInstructions(recipe: any) {
    setSelectedRecipe(recipe);
    setShowPopup(true);
    setInstructions(null);
    setRecipeInfo(null);

    const instructionsRes = await fetch(
      `http://localhost:8000/recipes/${recipe.id}/instructions`
    );
    const instructionsData = await instructionsRes.json();
    setInstructions(instructionsData);

    const cachedRecipeInfo = recipeInfoById[recipe.id];

    if (cachedRecipeInfo) {
      setRecipeInfo(cachedRecipeInfo);
    } else {
      const infoRes = await fetch(
        `http://localhost:8000/recipes/${recipe.id}/information`
      );
      const infoData = await infoRes.json();
      setRecipeInfo(infoData);
      setRecipeInfoById((prev) => ({
        ...prev,
        [recipe.id]: infoData,
      }));
    }
  }

  function closePopup() {
    setShowPopup(false);
    setSelectedRecipe(null);
    setInstructions(null);
    setRecipeInfo(null);
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

  function toggleDietFilter(filterName: keyof typeof dietFilters) {
    setDietFilters({
      ...dietFilters,
      [filterName]: !dietFilters[filterName],
    });
  }

  function recipeMatchesDietFilters(recipe: any) {
    const info = recipeInfoById[recipe.id];

    if (!info) {
      return !dietFilters.glutenFree &&
        !dietFilters.vegetarian &&
        !dietFilters.vegan &&
        !dietFilters.dairyFree;
    }

    if (dietFilters.glutenFree && !info.glutenFree) return false;
    if (dietFilters.vegetarian && !info.vegetarian) return false;
    if (dietFilters.vegan && !info.vegan) return false;
    if (dietFilters.dairyFree && !info.dairyFree) return false;

    return true;
  }

  function renderDietaryInformation() {
    if (!recipeInfo) return <p>Loading dietary information...</p>;

    return (
      <div>
        <h3>Dietary information</h3>
        <p>Vegetarian: {recipeInfo.vegetarian ? "Yes" : "No"}</p>
        <p>Vegan: {recipeInfo.vegan ? "Yes" : "No"}</p>
        <p>Gluten free: {recipeInfo.glutenFree ? "Yes" : "No"}</p>
        <p>Dairy free: {recipeInfo.dairyFree ? "Yes" : "No"}</p>

        <p>
          Diets: {recipeInfo.diets?.length > 0 ? recipeInfo.diets.join(", ") : "None"}
        </p>
      </div>
    );
  }

  function renderWinePairing() {
    if (!wantWineSuggestion) return null;
    if (!recipeInfo) return <p>Loading wine pairing...</p>;

    const winePairing = recipeInfo.winePairing;
    const pairedWines = winePairing?.pairedWines || [];

    return (
      <div>
        <h3>Wine pairing</h3>

        {pairedWines.length > 0 ? (
          <ul>
            {pairedWines.map((wine: string, index: number) => (
              <li key={index}>{wine}</li>
            ))}
          </ul>
        ) : (
          <p>No matching wines found.</p>
        )}

        {winePairing?.pairingText && <p>{winePairing.pairingText}</p>}
      </div>
    );
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
          onClick={() => setShowFilters(!showFilters)}
          style={{ marginRight: 10 }}
        >
          Filters
        </button>

        <button
          onClick={clearSearch}
          style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      {showFilters && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 4,
            width: 250,
          }}
        >
          <p>Dietary filters:</p>

          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={dietFilters.glutenFree}
              onChange={() => toggleDietFilter("glutenFree")}
            />
            Gluten free
          </label>

          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={dietFilters.vegetarian}
              onChange={() => toggleDietFilter("vegetarian")}
            />
            Vegetarian
          </label>

          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={dietFilters.vegan}
              onChange={() => toggleDietFilter("vegan")}
            />
            Vegan
          </label>

          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={dietFilters.dairyFree}
              onChange={() => toggleDietFilter("dairyFree")}
            />
            Dairy free
          </label>

          <label style={{ display: "block", marginTop: 10 }}>
            <input
              type="checkbox"
              checked={wantWineSuggestion}
              onChange={() => setWantWineSuggestion(!wantWineSuggestion)}
            />
            Show wine suggestion
          </label>
        </div>
      )}

      {/* results */}
      <div>
        {recipes.filter(recipeMatchesDietFilters).map((r) => {
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

            {renderDietaryInformation()}
            {renderWinePairing()}

            <h3>Instructions</h3>
            {renderInstructions()}
          </div>
        </div>
      )}
    </main>
  );
}