import os
import requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

API_KEY = os.getenv("SPOONACULAR_API_KEY")

# def search_recipes(ingredients: str):
#     url = "https://api.spoonacular.com/recipes/complexSearch"

#     params = {
#         "apiKey": API_KEY,
#         "includeIngredients": ingredients,
#         "number": 10,
#         "addRecipeInformation": True
#     }

#     response = requests.get(url, params=params)
#     data = response.json()

#     return data.get("results", [])


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
    season_ingredients = search_by_season()

    for recipe in data:

        # get all ingredients in recipe
        recipe_ingredients = []

        for ingredient in recipe.get("usedIngredients", []):
            recipe_ingredients.append(ingredient["name"].lower())

        for ingredient in recipe.get("missedIngredients", []):
            recipe_ingredients.append(ingredient["name"].lower())

        total_ingredients = len(recipe_ingredients)

        seasonal_count = 0
    
        seasonal_ingredients = []

        # count seasonal ingredients
        for ingredient_name in recipe_ingredients:

            for seasonal in season_ingredients:

                if seasonal.lower() in ingredient_name:
                    seasonal_ingredients.append(ingredient_name)
                    break

        recipe["seasonal_ingredients"] = seasonal_ingredients

        recipe["seasonal_match"] = (
            len(seasonal_ingredients) / total_ingredients
            if total_ingredients > 0 else 0
        )

    return data  # .get("results", [])


def get_recipe_instructions(recipe_id: int):
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/analyzedInstructions"

    params = {
        "apiKey": API_KEY,
    }

    response = requests.get(url, params=params)
    return response.json()


def search_by_season():
    month = datetime.now().month
    sweden_seasonal_ingredients = {
        1: [  # January
            "cabbage",
            "kale",
            "potatoes",
            "carrots",
            "parsnips",
            "beets",
            "celeriac",
            "onions",
            "lingonberries",
            "apples",
            "game meat"
        ],
        2: [  # February
            "cabbage",
            "kale",
            "potatoes",
            "carrots",
            "parsnips",
            "beets",
            "celeriac",
            "onions",
            "lingonberries",
            "apples",
            "cod"
        ],
        3: [  # March
            "kale",
            "cabbage",
            "potatoes",
            "carrots",
            "parsnips",
            "beets",
            "celeriac",
            "onions",
            "nettle",
            "cod"
        ],
        4: [  # April
            "asparagus",
            "nettle",
            "ramsons",
            "spinach",
            "radishes",
            "rhubarb",
            "spring onions",
            "trout",
            "herring"
        ],
        5: [  # May
            "asparagus",
            "rhubarb",
            "lettuce",
            "spinach",
            "radishes",
            "spring onions",
            "new potatoes",
            "chives",
            "dill",
            "salmon"
        ],
        6: [  # June
            "new potatoes",
            "strawberries",
            "asparagus",
            "peas",
            "lettuce",
            "cucumbers",
            "radishes",
            "dill",
            "chives",
            "salmon"
        ],
        7: [  # July
            "strawberries",
            "raspberries",
            "blueberries",
            "cherries",
            "peas",
            "beans",
            "zucchini",
            "cucumbers",
            "tomatoes",
            "new potatoes",
            "chanterelles"
        ],
        8: [  # August
            "blueberries",
            "lingonberries",
            "blackberries",
            "plums",
            "apples",
            "chanterelles",
            "corn",
            "beans",
            "zucchini",
            "tomatoes",
            "crayfish"
        ],
        9: [  # September
            "apples",
            "pears",
            "plums",
            "lingonberries",
            "chanterelles",
            "porcini mushrooms",
            "pumpkin",
            "beets",
            "carrots",
            "game meat"
        ],
        10: [  # October
            "pumpkin",
            "cabbage",
            "kale",
            "beets",
            "carrots",
            "parsnips",
            "celeriac",
            "potatoes",
            "apples",
            "lingonberries",
            "elk"
        ],
        11: [  # November
            "kale",
            "cabbage",
            "potatoes",
            "carrots",
            "parsnips",
            "beets",
            "celeriac",
            "onions",
            "lingonberries",
            "game meat",
            "herring"
        ],
        12: [  # December
            "kale",
            "red cabbage",
            "potatoes",
            "carrots",
            "beets",
            "parsnips",
            "onions",
            "lingonberries",
            "apples",
            "herring",
            "ham"
        ]
    }
    return sweden_seasonal_ingredients[month]

def get_recipe_instructions(recipe_id: int):
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/analyzedInstructions"

    params = {
        "apiKey": API_KEY,
    }

    response = requests.get(url, params=params)
    return response.json()


def get_recipe_wine_diet(recipe_id):
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"

    params = {
        "apiKey": API_KEY,
        "includeNutrition": "true",
        "addWinePairing": "true",
    }

    response = requests.get(url, params=params)
    return response.json()