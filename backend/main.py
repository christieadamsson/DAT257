from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from spoonacular import search_by_ingredients, get_recipe_instructions, get_recipe_wine_diet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recipes")
def get_recipes(ingredients: str = Query("")):
    recipes = search_by_ingredients(ingredients)
    

    return {"results": recipes}

@app.get("/recipes/{recipe_id}/instructions")
def get_instructions(recipe_id: int):
    return get_recipe_instructions(recipe_id)

@app.get("/recipes/{recipe_id}/information")
def get_recipe_information(recipe_id: int):
    return get_recipe_wine_diet(recipe_id)