"use client";

import { useState } from "react";
import SearchBox from "@/src/components/SearchBox";
import RecipeResults from "@/src/components/SearchResults";
import { Apple, Carrot, Egg, Fish, Leaf, Salad, Soup, Wheat } from "lucide-react";

export default function Page() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipeInfoById, setRecipeInfoById] = useState<Record<number, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [instructions, setInstructions] = useState<any>(null);
  const [recipeInfo, setRecipeInfo] = useState<any>(null);
  const [wantWineSuggestion, setWantWineSuggestion] = useState(false);

  const [dietFilters, setDietFilters] = useState({
    glutenFree: false,
    vegetarian: false,
    vegan: false,
    dairyFree: false,
  });

  function addIngredient() {
    if (!input.trim()) return;
    setIngredients([...ingredients, input.trim()]);
    setInput("");
  }

  function clearSearch() {
    setIngredients([]);
    setRecipes([]);
    setRecipeInfoById({});
    setWantWineSuggestion(false);
    setDietFilters({
      glutenFree: false,
      vegetarian: false,
      vegan: false,
      dairyFree: false,
    });
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
        } catch {
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
      setRecipeInfoById((prev) => ({ ...prev, [recipe.id]: infoData }));
    }
  }

  function closePopup() {
    setShowPopup(false);
    setSelectedRecipe(null);
    setInstructions(null);
    setRecipeInfo(null);
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
      return (
        !dietFilters.glutenFree &&
        !dietFilters.vegetarian &&
        !dietFilters.vegan &&
        !dietFilters.dairyFree
      );
    }

    if (dietFilters.glutenFree && !info.glutenFree) return false;
    if (dietFilters.vegetarian && !info.vegetarian) return false;
    if (dietFilters.vegan && !info.vegan) return false;
    if (dietFilters.dairyFree && !info.dairyFree) return false;

    return true;
  }

  function renderInstructions() {
    if (!instructions) return <p>Loading instructions...</p>;

    if (typeof instructions === "string") return <p>{instructions}</p>;

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

  function renderDietaryInformation() {
    if (!recipeInfo) return <p>Loading dietary information...</p>;

    return (
      <div>
        <h3>Dietary information</h3>
        <p>Vegetarian: {recipeInfo.vegetarian ? "Yes" : "No"}</p>
        <p>Vegan: {recipeInfo.vegan ? "Yes" : "No"}</p>
        <p>Gluten free: {recipeInfo.glutenFree ? "Yes" : "No"}</p>
        <p>Dairy free: {recipeInfo.dairyFree ? "Yes" : "No"}</p>
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

  const filteredRecipes = recipes.filter(recipeMatchesDietFilters);
  const backgroundIcons = [Carrot, Apple, Wheat, Salad, Soup, Egg, Fish, Leaf];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        color: "#2f3b22",
        background: "linear-gradient(180deg, #f7f8ef 0%, #eef4e8 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {backgroundIcons.map((Icon, index) => (
          <Icon
            key={index}
            size={90}
            strokeWidth={1.4}
            style={{
              position: "absolute",
              opacity: 0.07,
              color: "#2f6f3e",
              top: `${8 + index * 11}%`,
              left: `${index % 2 === 0 ? 7 : 82}%`,
              transform: `rotate(${index % 2 === 0 ? "-18deg" : "18deg"})`,
            }}
          />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ textAlign: "center", fontSize: 56 }}>
          <Leaf size={48} style={{ verticalAlign: "middle", marginRight: 10 }} />
          Sustainable Recipe Finder
        </h1>

        <SearchBox
          input={input}
          setInput={setInput}
          ingredients={ingredients}
          addIngredient={addIngredient}
          searchRecipes={searchRecipes}
          clearSearch={clearSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          dietFilters={dietFilters}
          toggleDietFilter={toggleDietFilter}
          wantWineSuggestion={wantWineSuggestion}
          setWantWineSuggestion={setWantWineSuggestion}
        />

        <RecipeResults
          recipes={filteredRecipes}
          openInstructions={openInstructions}
        />
      </div>

      {showPopup && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 28,
              borderRadius: 24,
              width: "90%",
              maxWidth: 700,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <button onClick={closePopup} style={{ float: "right" }}>
              ✕
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