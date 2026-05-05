import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SPOONACULAR_API_KEY")

def search_recipes(ingredients: str):
    url = "https://api.spoonacular.com/recipes/complexSearch"

    params = {
        "apiKey": API_KEY,
        "includeIngredients": ingredients,
        "number": 10,
        "addRecipeInformation": True
    }

    response = requests.get(url, params=params)
    data = response.json()

    return data.get("results", [])


def search_by_ingredients(ingredients: str):
    url = "https://api.spoonacular.com/recipes/findByIngredients"

    params = {
        "apiKey": API_KEY,
        "ingredients": ingredients,
        "number": 10,
        "ranking": 1
    }

    response = requests.get(url, params=params)
    data = response.json()

    return data #.get("results", [])