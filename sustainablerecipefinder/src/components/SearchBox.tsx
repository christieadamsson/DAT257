import Button from "@/src/components/Button";
import RecipeFilters from "@/src/components/RecipeFilters";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";

type DietFilters = {
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;
  dairyFree: boolean;
};

type SearchBoxProps = {
  input: string;
  setInput: (value: string) => void;
  ingredients: string[];
  addIngredient: () => void;
  searchRecipes: () => void;
  clearSearch: () => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  dietFilters: DietFilters;
  toggleDietFilter: (filterName: keyof DietFilters) => void;
  wantWineSuggestion: boolean;
  setWantWineSuggestion: (value: boolean) => void;
};

export default function SearchBox({
                                    input,
                                    setInput,
                                    ingredients,
                                    addIngredient,
                                    searchRecipes,
                                    clearSearch,
                                    showFilters,
                                    setShowFilters,
                                    dietFilters,
                                    toggleDietFilter,
                                    wantWineSuggestion,
                                    setWantWineSuggestion,
                                  }: SearchBoxProps) {
  return (
      <div
          style={{
            maxWidth: 560,
            margin: "30px auto",
            backgroundColor: "white",
            padding: 24,
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(47, 59, 34, 0.08)",
          }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ingredients"
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #bbbb9a",
              }}
          />

          <Button onClick={addIngredient} color="#bbbb9a" textColor="#2f3b22">
            <Plus size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Add
          </Button>
        </div>

        <p>Ingredients:</p>

        {ingredients.map((i, idx) => (
            <span
                key={idx}
                style={{
                  marginRight: 8,
                  backgroundColor: "#e8ead7",
                  color: "#2f3b22",
                  padding: "5px 10px",
                  borderRadius: 999,
                  display: "inline-block",
                  marginBottom: 6,
                }}
            >
          {i}
        </span>
        ))}

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button onClick={searchRecipes} color="#2f6f3e" textColor="white">
            <Search size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Search recipes
          </Button>

          <Button
              onClick={() => setShowFilters(!showFilters)}
              color="white"
              textColor="#2f3b22"
          >
            <SlidersHorizontal size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Filters
          </Button>

          <Button onClick={clearSearch} color="#ef4444" textColor="white">
            <X size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Clear
          </Button>
        </div>

        {showFilters && (
            <div style={{ marginTop: 20 }}>
              <RecipeFilters
                  dietFilters={dietFilters}
                  toggleDietFilter={toggleDietFilter}
                  wantWineSuggestion={wantWineSuggestion}
                  setWantWineSuggestion={setWantWineSuggestion}
              />
            </div>
        )}
      </div>
  );
}