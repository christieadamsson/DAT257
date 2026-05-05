from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from spoonacular import search_by_ingredients

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