def rank_recipes(recipes, ingredients: str):
    user_ingredients = [
        ingredient.strip().lower()
        for ingredient in ingredients.split(",")
        if ingredient.strip()
    ]

    ranked = []

    for recipe in recipes:
        title = recipe.get("title", "").lower()
        summary = recipe.get("summary", "").lower()

        score = 0

        for ingredient in user_ingredients:
            if ingredient in title or ingredient in summary:
                score += 1

        recipe["matchScore"] = score
        ranked.append(recipe)

    return sorted(ranked, key=lambda r: r["matchScore"], reverse=True)