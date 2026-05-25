type RecipeResultsProps = {
  recipes: any[];
  openInstructions: (recipe: any) => void;
};

export default function RecipeResults({
  recipes,
  openInstructions,
}: RecipeResultsProps) {
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "40px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24,
      }}
    >
      {recipes.map((r) => {
        const used = r.usedIngredientCount || 0;
        const missed = r.missedIngredientCount || 0;
        const total = used + missed;
        const missingIngredients = r.missedIngredients || [];

        return (
          <div
            key={r.id}
            onClick={() => openInstructions(r)}
            style={{
              cursor: "pointer",
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(47, 59, 34, 0.08)",
              border: "1px solid rgba(187, 187, 154, 0.25)",
            }}
          >
            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}

            <div style={{ padding: 20 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 20 }}>
                {r.title}
              </h3>

              <p style={{ fontWeight: 600 }}>
                Match: {used}/{total}
              </p>

              <p>
                Seasonal match: {Math.round((r.seasonal_match || 0) * 100)}%
              </p>

              <p style={{ color: "#667064", fontSize: 14 }}>
                Missing ingredients:
              </p>

              {missingIngredients.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
                  {missingIngredients.slice(0, 4).map((ingredient: any) => (
                    <li key={ingredient.id}>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#1f7a3f", fontWeight: 600 }}>
                  No missing ingredients
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}