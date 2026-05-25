type DietFilters = {
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;
  dairyFree: boolean;
};

type RecipeFiltersProps = {
  dietFilters: DietFilters;
  toggleDietFilter: (filterName: keyof DietFilters) => void;
  wantWineSuggestion: boolean;
  setWantWineSuggestion: (value: boolean) => void;
};

export default function RecipeFilters({
  dietFilters,
  toggleDietFilter,
  wantWineSuggestion,
  setWantWineSuggestion,
}: RecipeFiltersProps) {
  return (
    <div>
      <h3>Filters</h3>

      <label>
        <input
          type="checkbox"
          checked={dietFilters.glutenFree}
          onChange={() => toggleDietFilter("glutenFree")}
        />
        Gluten free
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={dietFilters.vegan}
          onChange={() => toggleDietFilter("vegan")}
        />
        Vegan
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={dietFilters.vegetarian}
          onChange={() => toggleDietFilter("vegetarian")}
        />
        Vegetarian
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={dietFilters.dairyFree}
          onChange={() => toggleDietFilter("dairyFree")}
        />
        Dairy free
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={wantWineSuggestion}
          onChange={() => setWantWineSuggestion(!wantWineSuggestion)}
        />
        Show wine suggestion
      </label>
    </div>
  );
}