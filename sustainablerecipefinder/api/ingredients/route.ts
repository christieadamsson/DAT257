import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Saknar SPOONACULAR_API_KEY" },
            { status: 500 }
        );
    }

    if (!query.trim()) {
        return NextResponse.json([]);
    }

    const url = new URL(
        "https://api.spoonacular.com/food/ingredients/autocomplete"
    );

    url.searchParams.set("query", query);
    url.searchParams.set("number", "8");
    url.searchParams.set("metaInformation", "true");
    url.searchParams.set("apiKey", apiKey);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
}