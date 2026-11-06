const BASE_URL = "https://nutriplan-api.vercel.app/api";
export async function getCategories() {
    const response = await fetch(`${BASE_URL}/meals/categories`);
    if (response && response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
            return data.results;
        }
    }


    const fallbackResponse = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    if (fallbackResponse && fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.categories) {
            return fallbackData.categories.map(function (c) {
                return {
                    id: c.idCategory,
                    name: c.strCategory,
                    thumbnail: c.strCategoryThumb,
                    description: c.strCategoryDescription
                };
            });
        }
    }
    return [];
}


export async function getMeals() {
    const response = await fetch(`${BASE_URL}/meals`);
    if (response && response.ok) {
        const data = await response.json();
        if (data && data.results) {
            return data.results;
        }
    }
    return [];
}

export async function getMealsByCategory(category) {
    const response = await fetch(`${BASE_URL}/meals/filter?category=${category}&page=1&limit=25`);
    if (response && response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
            return data.results;
        }
    }

    const fallbackResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    if (fallbackResponse && fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.meals) {
            return fallbackData.meals.map(function (m) {
                return {
                    id: m.idMeal,
                    name: m.strMeal,
                    thumbnail: m.strMealThumb
                };
            });
        }
    }
    return [];
}

export async function getMealsByArea(area) {
    const response = await fetch(`${BASE_URL}/meals/filter?area=${area}&page=1&limit=25`);
    if (response && response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
            return data.results;
        }
    }

    const fallbackResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    if (fallbackResponse && fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.meals) {
            return fallbackData.meals.map(function (m) {
                return {
                    id: m.idMeal,
                    name: m.strMeal,
                    thumbnail: m.strMealThumb
                };
            });
        }
    }
    return [];
}

export async function searchMeals(query) {
    const response = await fetch(`${BASE_URL}/meals/search?q=${query}&page=1&limit=25`);
    if (response && response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
            return data.results;
        }
    }

    const fallbackResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    if (fallbackResponse && fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.meals) {
            return fallbackData.meals.map(function (m) {
                return {
                    id: m.idMeal,
                    name: m.strMeal,
                    category: m.strCategory,
                    area: m.strArea,
                    instructions: m.strInstructions,
                    thumbnail: m.strMealThumb
                };
            });
        }
    }
    return [];
}

export async function getMealById(id) {
    const response = await fetch(`${BASE_URL}/meals/${id}`);
    if (response && response.ok) {
        const data = await response.json();
        if (data.result) return data.result;
        if (data.meal) return data.meal;
        if (data) return data;
    }

    const fallbackResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (fallbackResponse && fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.meals && fallbackData.meals.length > 0) {
            const m = fallbackData.meals[0];
            return {
                id: m.idMeal,
                name: m.strMeal,
                category: m.strCategory,
                area: m.strArea,
                instructions: m.strInstructions,
                thumbnail: m.strMealThumb,
                tags: m.strTags,
                youtube: m.strYoutube
            };
        }
    }
    return null;
}

export async function analyzeRecipeNutrition(recipeName, ingredients) {
    const apiKey = localStorage.getItem("usda_api_key") || "DEMO_KEY";
    const response = await fetch(`${BASE_URL}/nutrition/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            recipeName: recipeName,
            ingredients: ingredients
        })
    });

    const data = await response.json();
    return data;
}


export async function searchProducts(query) {
    const response = await fetch(`${BASE_URL}/products/search?q=${query}&page=1&limit=24`);
    const data = await response.json();
    const results = data.results || [];
    results.total = (data.pagination && data.pagination.total !== undefined) ? data.pagination.total : results.length;
    return results;
}


export async function getProductByBarcode(barcode) {
    const response = await fetch(`${BASE_URL}/products/barcode/${barcode}`);
    const data = await response.json();
    let results = [];
    if (data.results) {
        results = Array.isArray(data.results) ? data.results : [data.results];
    } else if (data.result) {
        results = [data.result];
    } else if (data.product) {
        results = [data.product];
    } else if (data && data.name) {
        results = [data];
    }
    results.total = results.length;
    return results;
}


export async function getProductsByCategory(category) {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    const data = await response.json();
    const results = data.results || [];
    results.total = (data.pagination && data.pagination.total !== undefined) ? data.pagination.total : results.length;
    return results;
}


export async function getProductCategories() {
    const response = await fetch(`${BASE_URL}/products/categories`);
    const data = await response.json();
    return data.results || [];
}

