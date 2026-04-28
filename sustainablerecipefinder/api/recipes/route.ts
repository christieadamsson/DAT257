import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const ingredients = searchParams.get("ingredients") || "";
    const intolerances = searchParams.get("intolerances") || "";
    const query = searchParams.get("query") || "";
    const number = searchParams.get("number") || "10";

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Saknar SPOONACULAR_API_KEY i env." },
            { status: 500 }
        );
    }

    const spoonacularUrl = new URL(
        "https://api.spoonacular.com/recipes/complexSearch"
    );

    if (query) spoonacularUrl.searchParams.set("query", query);
    if (ingredients) spoonacularUrl.searchParams.set("includeIngredients", ingredients);
    if (intolerances) spoonacularUrl.searchParams.set("intolerances", intolerances);

    spoonacularUrl.searchParams.set("number", number);
    spoonacularUrl.searchParams.set("addRecipeInformation", "true");
    spoonacularUrl.searchParams.set("apiKey", apiKey);

    const response = await fetch(spoonacularUrl.toString(), {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
}