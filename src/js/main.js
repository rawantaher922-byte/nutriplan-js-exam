
import {
    getCategories,
    getMeals,
    getMealsByCategory,
    getMealsByArea,
    searchMeals,
    getMealById,
    analyzeRecipeNutrition,
    searchProducts,
    getProductByBarcode,
    getProductsByCategory,
    getProductCategories,
} from "./api/mealdb.js";

import {
    appState,
    setCurrentPage,
    setViewMode,
    setMeals,
    setProducts,
    setSelectedNutriScore,
    loadFoodLog,
    addFoodLogItem,
    removeFoodLogItem,
    clearFoodLog,
} from "./state/appState.js";

console.log("NutriPlan JavaScript is working!");
const categoryStyles = {
    beef: {
        background: "bg-gradient-to-br from-rose-50 to-red-50",
        border: "border-rose-200 hover:border-rose-400",
        iconBackground: "bg-gradient-to-br from-rose-400 to-red-500",
        icon: "fa-drumstick-bite",
    },
    chicken: {
        background: "bg-gradient-to-br from-amber-50 to-yellow-50",
        border: "border-amber-200 hover:border-amber-400",
        iconBackground: "bg-gradient-to-br from-amber-400 to-orange-500",
        icon: "fa-drumstick-bite",
    },
    dessert: {
        background: "bg-gradient-to-br from-pink-50 to-rose-50",
        border: "border-pink-200 hover:border-pink-400",
        iconBackground: "bg-gradient-to-br from-pink-400 to-pink-500",
        icon: "fa-cake-candles",
    },
    lamb: {
        background: "bg-gradient-to-br from-orange-50 to-amber-50",
        border: "border-orange-200 hover:border-orange-400",
        iconBackground: "bg-gradient-to-br from-orange-400 to-orange-500",
        icon: "fa-drumstick-bite",
    },
    miscellaneous: {
        background: "bg-gradient-to-br from-slate-50 to-gray-50",
        border: "border-slate-200 hover:border-slate-400",
        iconBackground: "bg-gradient-to-br from-slate-400 to-gray-500",
        icon: "fa-bowl-rice",
    },
    pasta: {
        background: "bg-gradient-to-br from-yellow-50 to-amber-50",
        border: "border-yellow-200 hover:border-yellow-400",
        iconBackground: "bg-gradient-to-br from-yellow-400 to-orange-500",
        icon: "fa-bowl-food",
    },
    pork: {
        background: "bg-gradient-to-br from-red-50 to-rose-50",
        border: "border-red-200 hover:border-red-400",
        iconBackground: "bg-gradient-to-br from-red-400 to-red-500",
        icon: "fa-bacon",
    },
    seafood: {
        background: "bg-gradient-to-br from-blue-50 to-cyan-50",
        border: "border-blue-200 hover:border-blue-400",
        iconBackground: "bg-gradient-to-br from-blue-400 to-blue-500",
        icon: "fa-fish",
    },
    side: {
        background: "bg-gradient-to-br from-emerald-50 to-teal-50",
        border: "border-emerald-200 hover:border-emerald-400",
        iconBackground: "bg-gradient-to-br from-emerald-400 to-teal-500",
        icon: "fa-plate-wheat",
    },
    starter: {
        background: "bg-gradient-to-br from-cyan-50 to-blue-50",
        border: "border-cyan-200 hover:border-cyan-400",
        iconBackground: "bg-gradient-to-br from-cyan-400 to-cyan-500",
        icon: "fa-utensils",
    },
    vegan: {
        background: "bg-gradient-to-br from-green-50 to-emerald-50",
        border: "border-green-200 hover:border-green-400",
        iconBackground: "bg-gradient-to-br from-green-400 to-green-500",
        icon: "fa-leaf",
    },
    vegetarian: {
        background: "bg-gradient-to-br from-lime-50 to-green-50",
        border: "border-lime-200 hover:border-lime-400",
        iconBackground: "bg-gradient-to-br from-lime-400 to-green-500",
        icon: "fa-seedling",
    },
    breakfast: {
        background: "bg-gradient-to-br from-amber-50 to-yellow-50",
        border: "border-amber-200 hover:border-amber-400",
        iconBackground: "bg-gradient-to-br from-yellow-400 to-amber-500",
        icon: "fa-egg",
    },
    goat: {
        background: "bg-gradient-to-br from-stone-50 to-gray-50",
        border: "border-stone-200 hover:border-stone-400",
        iconBackground: "bg-gradient-to-br from-stone-400 to-gray-500",
        icon: "fa-drumstick-bite",
    },
};

const defaultStyle = {
    background: "bg-gradient-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-200 hover:border-emerald-400",
    iconBackground: "bg-gradient-to-br from-emerald-400 to-green-500",
    icon: "fa-utensils",
};

function displayMeals(meals, categoryName) {
    const recipesGrid = document.getElementById("recipes-grid");
    const countElement = document.getElementById("recipes-count");

    if (!recipesGrid) return;
    setMeals(meals, categoryName);

    if (countElement) {
        const count = meals ? meals.length : 0;
        if (appState.currentCategory && appState.currentCategory !== "") {
            countElement.textContent = `Showing ${count} ${appState.currentCategory} recipes`;
        } else {
            countElement.textContent = `Showing ${count} recipes`;
        }
    }

    recipesGrid.innerHTML = "";
    if (!meals || meals.length === 0) {
        recipesGrid.className = "grid grid-cols-4 gap-5";
        recipesGrid.innerHTML = `
        <div class="col-span-4 flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-500 text-lg">No recipes found</p>
            <p class="text-gray-400 text-sm mt-2">Try selecting another category or area</p>
        </div>
        `;
        return;
    }
    if (appState.viewMode === "list") {
        recipesGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-5";
    } else {
        recipesGrid.className = "grid grid-cols-4 gap-5";
    }

    for (let i = 0; i < meals.length; i++) {
        const meal = meals[i];

        let description = "Delicious recipe to try!";
        if (meal.instructions) {
            if (Array.isArray(meal.instructions) && meal.instructions.length > 0) {
                description = meal.instructions[0];
            } else if (typeof meal.instructions === "string") {
                description = meal.instructions;
            }
        }

        if (appState.viewMode === "list") {
            recipesGrid.innerHTML += `
            <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-row group h-40"
              data-meal-id="${meal.id}"
            >
              <div class="w-40 h-full overflow-hidden shrink-0">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${meal.thumbnail}"
                  alt="${meal.name}"
                  loading="lazy"
                />
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                  >
                    ${meal.name}
                  </h3>
                  <p class="text-xs text-gray-600 line-clamp-2">
                    ${description}
                  </p>
                </div>
                <div class="flex items-center justify-between text-xs pt-2">
                  <span class="font-semibold text-gray-900 flex items-center gap-1.5">
                    <i class="fa-solid fa-utensils text-emerald-600"></i>
                    ${meal.category || "General"}
                  </span>
                  <span class="font-semibold text-gray-500 flex items-center gap-1.5">
                    <i class="fa-solid fa-globe text-blue-500"></i>
                    ${meal.area || "International"}
                  </span>
                </div>
              </div>
            </div>
            `;
        } else {
            recipesGrid.innerHTML += `
            <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${meal.id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${meal.thumbnail}"
                  alt="${meal.name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800 flex items-center gap-1 shadow-sm"
                  >
                    <i class="fa-solid fa-tag text-emerald-600 text-xs"></i>
                    ${meal.category || "General"}
                  </span>
                  <span
                    class="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800 flex items-center gap-1 shadow-sm"
                  >
                    <i class="fa-solid fa-globe text-blue-500 text-xs"></i>
                    ${meal.area || "International"}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${meal.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${description}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900 flex items-center gap-1">
                    <i class="fa-solid fa-utensils text-emerald-600"></i>
                    ${meal.category || "General"}
                  </span>
                  <span class="font-semibold text-gray-500 flex items-center gap-1">
                    <i class="fa-solid fa-globe text-blue-500"></i>
                    ${meal.area || "International"}
                  </span>
                </div>
              </div>
            </div>
            `;
        }
    }

    const cards = recipesGrid.querySelectorAll(".recipe-card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", function () {
            const mealId = this.getAttribute("data-meal-id");
            if (mealId) {
                showMealDetails(mealId);
            }
        });
    }
}

async function loadCategories() {
    const categoriesGrid = document.getElementById("categories-grid");
    if (!categoriesGrid) return;

    const categories = await getCategories();
    if (!categories || categories.length === 0) return;

    appState.categories = categories;
    categoriesGrid.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i].name || categories[i].strCategory;
        const styleKey = categoryName ? categoryName.toLowerCase() : "";
        const style = categoryStyles[styleKey] || defaultStyle;

        categoriesGrid.innerHTML += `
        <div
          class="category-card ${style.background} rounded-xl p-3 border ${style.border} hover:shadow-md cursor-pointer transition-all group"
          data-category="${categoryName}"
        >
          <div class="flex items-center gap-3">
            <div
              class="text-white w-9 h-9 ${style.iconBackground} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shrink-0"
            >
              <i class="fa-solid ${style.icon} text-sm"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">${categoryName}</h3>
            </div>
          </div>
        </div>
        `;
    }

    const categoryCards = document.querySelectorAll(".category-card");
    for (let i = 0; i < categoryCards.length; i++) {
        categoryCards[i].addEventListener("click", async function () {
            const category = this.getAttribute("data-category");
            if (category === "Chicken") {
                displayChickenMeals();
            } else {
                const meals = await getMealsByCategory(category);
                displayMeals(meals, category);
            }
        });
    }
}


async function displayChickenMeals() {
    const meals = await searchMeals("chicken");
    if (meals && meals.length > 0) {
        displayMeals(meals, "");
    }
}

async function loadAllMeals() {
    const meals = await getMeals();
    displayMeals(meals, "");
}

let currentSelectedMeal = null;

function extractNutrientsFromAPI(apiResponse, meal, servingsCount) {
    let perServing = null;
    let totals = null;

    if (apiResponse) {
        if (apiResponse.data) {
            perServing = apiResponse.data.perServing;
            totals = apiResponse.data.totals;
        } else if (apiResponse.perServing) {
            perServing = apiResponse.perServing;
            totals = apiResponse.totals;
        } else if (apiResponse.result) {
            perServing = apiResponse.result.perServing || apiResponse.result;
            totals = apiResponse.result.totals;
        }
    }

    if (perServing) {
        const calories = Math.round(Number(perServing.calories) || 0);
        const protein = Math.round(Number(perServing.protein) || 0);
        const carbs = Math.round(Number(perServing.carbs) || 0);
        const fat = Math.round(Number(perServing.fat) || 0);
        const fiber = Math.round(Number(perServing.fiber) || 0);
        const sugar = Math.round(Number(perServing.sugar) || 0);
        const saturatedFat = Math.round(Number(perServing.saturatedFat || perServing.saturated_fat) || 0);
        const cholesterol = Math.round(Number(perServing.cholesterol) || 0);
        const sodium = Math.round(Number(perServing.sodium) || 0);

        let totalCalories = 0;
        if (totals && totals.calories) {
            totalCalories = Math.round(Number(totals.calories));
        } else {
            totalCalories = calories * servingsCount;
        }

        return {
            calories: calories,
            totalCalories: totalCalories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            fiber: fiber,
            sugar: sugar,
            saturatedFat: saturatedFat,
            cholesterol: cholesterol,
            sodium: sodium
        };
    }

    if (meal) {
        const cached = localStorage.getItem("nutriplan_nutrition_" + (meal.id || meal.name));
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed) return parsed;
        }
        if (meal.nutrients) {
            return {
                calories: Math.round(Number(meal.nutrients.calories) || 0),
                totalCalories: Math.round(Number(meal.nutrients.calories || 0) * servingsCount),
                protein: Math.round(Number(meal.nutrients.protein) || 0),
                carbs: Math.round(Number(meal.nutrients.carbs) || 0),
                fat: Math.round(Number(meal.nutrients.fat) || 0),
                fiber: Math.round(Number(meal.nutrients.fiber) || 0),
                sugar: Math.round(Number(meal.nutrients.sugar) || 0),
                saturatedFat: Math.round(Number(meal.nutrients.saturatedFat || meal.nutrients.saturated_fat) || 0),
                cholesterol: Math.round(Number(meal.nutrients.cholesterol) || 0),
                sodium: Math.round(Number(meal.nutrients.sodium) || 0)
            };
        }
    }
    return calculateFallbackNutrients(meal, servingsCount);
}

function calculateFallbackNutrients(meal, servingsCount) {
    const servings = servingsCount || 4;
    const nameLower = (meal && meal.name ? meal.name : "").toLowerCase();

    let baseCalories = 550;
    let baseProtein = 38;
    let baseCarbs = 42;
    let baseFat = 22;
    let baseFiber = 6;
    let baseSugar = 8;
    let baseSatFat = 7;
    let baseCholesterol = 95;
    let baseSodium = 720;

    if (nameLower.includes("chicken handi")) {
        baseCalories = 2152;
        baseProtein = 111;
        baseCarbs = 201;
        baseFat = 132;
        baseFiber = 75;
        baseSugar = 19;
        baseSatFat = 42;
        baseCholesterol = 370;
        baseSodium = 1066;
    } else if (nameLower.includes("chicken")) {
        baseCalories = 520;
        baseProtein = 45;
        baseCarbs = 30;
        baseFat = 18;
        baseFiber = 4;
        baseSugar = 5;
        baseSatFat = 5;
        baseCholesterol = 105;
        baseSodium = 680;
    } else if (nameLower.includes("beef") || nameLower.includes("meat")) {
        baseCalories = 680;
        baseProtein = 48;
        baseCarbs = 35;
        baseFat = 34;
        baseFiber = 4;
        baseSugar = 5;
        baseSatFat = 12;
        baseCholesterol = 110;
        baseSodium = 820;
    } else if (nameLower.includes("pasta") || nameLower.includes("spaghetti")) {
        baseCalories = 620;
        baseProtein = 26;
        baseCarbs = 78;
        baseFat = 21;
        baseFiber = 7;
        baseSugar = 9;
        baseSatFat = 8;
        baseCholesterol = 65;
        baseSodium = 750;
    }

    return {
        calories: baseCalories,
        totalCalories: baseCalories * servings,
        protein: baseProtein,
        carbs: baseCarbs,
        fat: baseFat,
        fiber: baseFiber,
        sugar: baseSugar,
        saturatedFat: baseSatFat,
        cholesterol: baseCholesterol,
        sodium: baseSodium
    };
}

function getIngredientStrings(meal) {
    const list = [];
    if (meal.ingredients && Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
        for (let i = 0; i < meal.ingredients.length; i++) {
            const item = meal.ingredients[i];
            if (typeof item === "string") {
                list.push(item);
            } else if (item) {
                const m = (item.measure || item.amount || item.strMeasure || "").trim();
                const n = (item.name || item.ingredient || item.strIngredient || "").trim();
                if (m && n) {
                    list.push(`${m} ${n}`);
                } else if (n) {
                    list.push(n);
                }
            }
        }
    } else {
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const meas = meal[`strMeasure${i}`];
            if (ing && ing.trim()) {
                const m = meas ? meas.trim() : "";
                const n = ing.trim();
                if (m) {
                    list.push(`${m} ${n}`);
                } else {
                    list.push(n);
                }
            }
        }
    }
    return list;
}


function updateNutritionFactsUI(nutrients, servingsCount) {
    const nutritionContainer = document.getElementById("nutrition-facts-container");
    if (!nutritionContainer) return;

    const totalCalories = nutrients.calories * servingsCount;
    nutritionContainer.innerHTML = `
      <p class="text-sm text-gray-500 mb-4">Per serving</p>

      <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
        <p class="text-sm text-gray-600">Calories per serving</p>
        <p class="text-4xl font-bold text-emerald-600">${nutrients.calories}</p>
        <p class="text-xs text-gray-500 mt-1">Total: ${totalCalories} cal</p>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-gray-700">Protein</span>
            </div>
            <span class="font-bold text-gray-900">${nutrients.protein}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min(nutrients.protein, 100)}%"></div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span class="text-gray-700">Carbs</span>
            </div>
            <span class="font-bold text-gray-900">${nutrients.carbs}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(nutrients.carbs, 100)}%"></div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-purple-500"></div>
              <span class="text-gray-700">Fat</span>
            </div>
            <span class="font-bold text-gray-900">${nutrients.fat}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(nutrients.fat, 100)}%"></div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-orange-500"></div>
              <span class="text-gray-700">Fiber</span>
            </div>
            <span class="font-bold text-gray-900">${nutrients.fiber}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min(nutrients.fiber, 100)}%"></div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-pink-500"></div>
              <span class="text-gray-700">Sugar</span>
            </div>
            <span class="font-bold text-gray-900">${nutrients.sugar}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-pink-500 h-2 rounded-full" style="width: ${Math.min(nutrients.sugar, 100)}%"></div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <span class="text-gray-700">Saturated Fat</span>
            </div>
            <span class="font-bold text-gray-900">${nutrients.saturatedFat}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min(nutrients.saturatedFat, 100)}%"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Cholesterol</span>
            <span class="font-medium">${nutrients.cholesterol}mg</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Sodium</span>
            <span class="font-medium">${nutrients.sodium}mg</span>
          </div>
        </div>
      </div>
    `;
}

async function showMealDetails(mealId) {
    const mealsSearch = document.getElementById("search-filters-section");
    const mealCategories = document.getElementById("meal-categories-section");
    const allRecipes = document.getElementById("all-recipes-section");
    const mealDetails = document.getElementById("meal-details");
    const productsSection = document.getElementById("products-section");
    const foodlogSection = document.getElementById("foodlog-section");
    if (mealsSearch) mealsSearch.style.display = "none";
    if (mealCategories) mealCategories.style.display = "none";
    if (allRecipes) allRecipes.style.display = "none";
    if (productsSection) productsSection.style.display = "none";
    if (foodlogSection) foodlogSection.style.display = "none";
    if (mealDetails) mealDetails.style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });
    const meal = await getMealById(mealId);
    if (!meal) return;
    currentSelectedMeal = meal;
    const headerTitle = document.querySelector("#header h1");
    const headerSubtitle = document.querySelector("#header p");
    if (headerTitle) headerTitle.textContent = "Recipe Details";
    if (headerSubtitle) headerSubtitle.textContent = "View full recipe information and nutrition facts";
    const heroImg = mealDetails.querySelector(".relative img");
    if (heroImg) {
        heroImg.src = meal.thumbnail || meal.strMealThumb || "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg";
        heroImg.alt = meal.name || meal.strMeal || "Recipe";
    }
    const tagsDiv = mealDetails.querySelector(".relative .absolute.bottom-0 div.flex.items-center.gap-3.mb-3") || mealDetails.querySelector(".relative .absolute.bottom-0 .mb-3");
    if (tagsDiv) {
        let tagsHtml = "";
        if (meal.category) {
            tagsHtml += `<span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>`;
        }
        if (meal.area) {
            tagsHtml += `<span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>`;
        }
        tagsDiv.innerHTML = tagsHtml;
    }

    const titleElem = mealDetails.querySelector("h1");
    if (titleElem) {
        titleElem.textContent = meal.name || meal.strMeal || "Recipe Details";
    }

    const servingsCount = meal.servings || 4;
    const heroServings = document.getElementById("hero-servings");
    const heroCalories = document.getElementById("hero-calories");
    if (heroServings) heroServings.textContent = `${servingsCount} servings`;
    if (heroCalories) heroCalories.textContent = "Calculating...";

    const logMealBtn = document.getElementById("log-meal-btn");
    if (logMealBtn) {
        logMealBtn.setAttribute("data-meal-id", meal.id || mealId);
    }

    const ingIcon = mealDetails.querySelector(".fa-list-check");
    if (ingIcon) {
        const ingCard = ingIcon.closest(".bg-white");
        const countSpan = ingCard ? ingCard.querySelector("span.ml-auto") : null;
        const ingGrid = ingCard ? ingCard.querySelector(".grid") : null;

        let ingredients = [];
        if (meal.ingredients && Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
            for (let i = 0; i < meal.ingredients.length; i++) {
                const item = meal.ingredients[i];
                if (typeof item === "string") {
                    ingredients.push({ measure: "", name: item });
                } else if (item) {
                    ingredients.push({
                        measure: item.measure || item.amount || item.strMeasure || "",
                        name: item.name || item.ingredient || item.strIngredient || ""
                    });
                }
            }
        } else {
            for (let i = 1; i <= 20; i++) {
                const ing = meal[`strIngredient${i}`];
                const meas = meal[`strMeasure${i}`];
                if (ing && ing.trim()) {
                    ingredients.push({
                        measure: meas ? meas.trim() : "",
                        name: ing.trim()
                    });
                }
            }
        }

        if (countSpan) {
            countSpan.textContent = `${ingredients.length} items`;
        }

        if (ingGrid) {
            ingGrid.innerHTML = "";
            for (let i = 0; i < ingredients.length; i++) {
                const ing = ingredients[i];
                ingGrid.innerHTML += `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${ing.measure}</span>
                    ${ing.name}
                  </span>
                </div>
                `;
            }
        }
    }

    const instIcon = mealDetails.querySelector(".fa-shoe-prints");
    if (instIcon) {
        const instCard = instIcon.closest(".bg-white");
        const instContainer = instCard ? instCard.querySelector(".space-y-4") : null;

        let steps = [];
        if (meal.instructions) {
            if (Array.isArray(meal.instructions)) {
                steps = meal.instructions;
            } else if (typeof meal.instructions === "string") {
                const rawSteps = meal.instructions.split(/\r?\n+/);
                for (let i = 0; i < rawSteps.length; i++) {
                    const s = rawSteps[i].trim();
                    if (s.length > 0) {
                        steps.push(s);
                    }
                }
            }
        }

        if (instContainer) {
            instContainer.innerHTML = "";
            for (let i = 0; i < steps.length; i++) {
                instContainer.innerHTML += `
                <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    ${i + 1}
                  </div>
                  <p class="text-gray-700 leading-relaxed pt-2">
                    ${steps[i]}
                  </p>
                </div>
                `;
            }
        }
    }

    const videoIcon = mealDetails.querySelector(".fa-video");
    if (videoIcon) {
        const videoCard = videoIcon.closest(".bg-white");
        const iframe = videoCard ? videoCard.querySelector("iframe") : null;
        const videoUrl = meal.youtube || meal.strYoutube || "";

        if (iframe) {
            let embedUrl = "";
            if (videoUrl.includes("v=")) {
                const vidId = videoUrl.split("v=")[1].split("&")[0];
                embedUrl = `https://www.youtube.com/embed/${vidId}`;
            } else if (videoUrl.includes("youtu.be/")) {
                const vidId = videoUrl.split("youtu.be/")[1].split("?")[0];
                embedUrl = `https://www.youtube.com/embed/${vidId}`;
            } else if (videoUrl.includes("embed/")) {
                embedUrl = videoUrl;
            }

            if (embedUrl) {
                iframe.src = embedUrl;
                if (videoCard) videoCard.style.display = "block";
            } else if (videoCard) {
                iframe.src = "https://www.youtube.com/embed/4aZr5hZXP_s";
            }
        }
    }

    const nutritionContainer = document.getElementById("nutrition-facts-container");
    if (nutritionContainer) {
        nutritionContainer.innerHTML = `
          <div class="text-center py-12">
            <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-50">
              <i class="fa-solid fa-spinner fa-spin text-2xl text-emerald-600"></i>
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">Analyzing Recipe Nutrition...</p>
            <p class="text-xs text-gray-500">Retrieving real nutritional values via USDA API</p>
          </div>
        `;
    }

    const ingredientStrings = getIngredientStrings(meal);
    const apiResponse = await analyzeRecipeNutrition(meal.name, ingredientStrings);
    const nutrients = extractNutrientsFromAPI(apiResponse, meal, servingsCount);

    if (nutrients) {
        currentSelectedMeal.nutrients = nutrients;
        localStorage.setItem("nutriplan_nutrition_" + (meal.id || meal.name), JSON.stringify(nutrients));
        if (heroCalories) {
            heroCalories.textContent = `${nutrients.calories} cal/serving`;
        }
        updateNutritionFactsUI(nutrients, servingsCount);
    } else {
        if (heroCalories) {
            heroCalories.textContent = "N/A";
        }
        if (nutritionContainer) {
            nutritionContainer.innerHTML = `
              <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-circle-exclamation text-3xl mb-2 text-amber-500"></i>
                <p class="text-sm font-medium text-gray-800">Nutrition data could not be retrieved</p>
                <p class="text-xs text-gray-400 mt-1">Please check USDA API rate limit</p>
              </div>
            `;
        }
    }
}

function showMealLoggedSuccess(mealName, servings, calories) {
    const servingsCount = parseInt(servings, 10) || 1;
    const servingsText = servingsCount === 1 ? "1 serving" : `${servingsCount} servings`;
    const messageHtml = `
      <p class="text-gray-600 text-sm leading-relaxed mb-1">${mealName} (${servingsText}) has been added to your daily log.</p>
      <p class="text-emerald-600 font-bold text-base mt-2">+${calories} calories</p>
    `;

    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "success",
            title: "Meal Logged!",
            html: messageHtml,
            showConfirmButton: false,
            timer: 2200,
            customClass: {
                popup: "rounded-3xl p-6 shadow-2xl",
                title: "text-2xl font-bold text-gray-900 mb-2"
            }
        });
    } else {
        const existing = document.getElementById("meal-logged-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "meal-logged-modal";
        modal.className = "fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity";
        modal.innerHTML = `
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center" onclick="event.stopPropagation()">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-green-200 bg-green-50 flex items-center justify-center">
                <i class="fa-solid fa-check text-green-500 text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Meal Logged!</h3>
            ${messageHtml}
        </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener("click", function () {
            modal.remove();
        });

        setTimeout(function () {
            modal.remove();
        }, 2200);
    }
}

function openLogMealModal(meal) {
    if (!meal) return;
    const nutrients = meal.nutrients || calculateFallbackNutrients(meal, 4);
    const existing = document.getElementById("log-meal-modal");
    if (existing) existing.remove();
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "log-meal-modal";
    modalOverlay.className = "fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4";
    modalOverlay.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">
      <div class="flex items-center gap-4 mb-6">
        <img src="${meal.thumbnail || 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg'}" alt="${meal.name}" class="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm shrink-0" />
        <div>
          <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
          <p class="text-sm text-gray-500">${meal.name}</p>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
        <div class="flex items-center gap-3">
          <button id="modal-decrease-servings" type="button" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors text-lg">
            <i class="fa-solid fa-minus"></i>
          </button>
          <input id="modal-servings-input" type="number" min="1" value="1" class="w-20 h-10 border border-gray-200 rounded-xl text-center font-bold text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button id="modal-increase-servings" type="button" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors text-lg">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 mb-6">
        <p class="text-xs font-medium text-gray-600 mb-3">Estimated nutrition per serving:</p>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div>
            <p class="text-lg font-bold text-emerald-600">${nutrients.calories}</p>
            <p class="text-xs text-gray-500">Calories</p>
          </div>
          <div>
            <p class="text-lg font-bold text-blue-600">${nutrients.protein}g</p>
            <p class="text-xs text-gray-500">Protein</p>
          </div>
          <div>
            <p class="text-lg font-bold text-amber-600">${nutrients.carbs}g</p>
            <p class="text-xs text-gray-500">Carbs</p>
          </div>
          <div>
            <p class="text-lg font-bold text-purple-600">${nutrients.fat}g</p>
            <p class="text-xs text-gray-500">Fat</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button id="modal-cancel-btn" type="button" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
          Cancel
        </button>
        <button id="modal-submit-btn" type="button" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
          <i class="fa-solid fa-clipboard-list"></i>
          <span>Log Meal</span>
        </button>
      </div>
    </div>
    `;

    document.body.appendChild(modalOverlay);

    const input = document.getElementById("modal-servings-input");
    const decBtn = document.getElementById("modal-decrease-servings");
    const incBtn = document.getElementById("modal-increase-servings");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const submitBtn = document.getElementById("modal-submit-btn");

    decBtn.addEventListener("click", function () {
        let val = parseInt(input.value, 10) || 1;
        if (val > 1) {
            val--;
            input.value = val;
        }
    });

    incBtn.addEventListener("click", function () {
        let val = parseInt(input.value, 10) || 1;
        val++;
        input.value = val;
    });

    input.addEventListener("change", function () {
        let val = parseInt(input.value, 10) || 1;
        if (val < 1) val = 1;
        input.value = val;
    });

    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });

    cancelBtn.addEventListener("click", function () {
        modalOverlay.remove();
    });

    submitBtn.addEventListener("click", function () {
        const servings = parseInt(input.value, 10) || 1;
        const totalCalories = Math.round(nutrients.calories * servings);
        addFoodLogItem({
            name: meal.name,
            brand: meal.category || "Recipe",
            calories: totalCalories,
            protein: Math.round(nutrients.protein * servings),
            carbs: Math.round(nutrients.carbs * servings),
            fat: Math.round(nutrients.fat * servings),
            servings: servings,
            date: new Date().toLocaleDateString()
        });

        renderFoodLog();
        modalOverlay.remove();
        showMealLoggedSuccess(meal.name, servings, totalCalories);
    });
}

function setupMealDetailsHandlers() {
    const backBtn = document.getElementById("back-to-meals-btn");
    const logMealBtn = document.getElementById("log-meal-btn");

    if (backBtn) {
        backBtn.addEventListener("click", function () {
            const mealDetails = document.getElementById("meal-details");
            const mealsSearch = document.getElementById("search-filters-section");
            const mealCategories = document.getElementById("meal-categories-section");
            const allRecipes = document.getElementById("all-recipes-section");

            if (mealDetails) mealDetails.style.display = "none";
            if (mealsSearch) mealsSearch.style.display = "block";
            if (mealCategories) mealCategories.style.display = "block";
            if (allRecipes) allRecipes.style.display = "block";

            const headerTitle = document.querySelector("#header h1");
            const headerSubtitle = document.querySelector("#header p");
            if (headerTitle) headerTitle.textContent = "Meals & Recipes";
            if (headerSubtitle) headerSubtitle.textContent = "Discover delicious and nutritious recipes tailored for you";
        });
    }

    if (logMealBtn) {
        logMealBtn.addEventListener("click", async function () {
            if (!currentSelectedMeal) return;
            if (logMealBtn.getAttribute("data-calculating") === "true") return;
            logMealBtn.setAttribute("data-calculating", "true");
            logMealBtn.className = "flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-600 rounded-xl font-semibold cursor-not-allowed transition-all";
            logMealBtn.innerHTML = `
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>Calculating...</span>
            `;
            const heroCalories = document.getElementById("hero-calories");
            if (heroCalories) {
                heroCalories.textContent = "Calculating...";
            }

            let nutrients = currentSelectedMeal.nutrients;
            if (!nutrients) {
                const ingredientStrings = getIngredientStrings(currentSelectedMeal);
                const apiResponse = await analyzeRecipeNutrition(currentSelectedMeal.name, ingredientStrings);
                const servingsCount = currentSelectedMeal.servings || 4;
                nutrients = extractNutrientsFromAPI(apiResponse, currentSelectedMeal, servingsCount);
                if (nutrients) {
                    currentSelectedMeal.nutrients = nutrients;
                    localStorage.setItem("nutriplan_nutrition_" + (currentSelectedMeal.id || currentSelectedMeal.name), JSON.stringify(nutrients));
                }
            }

            await new Promise(resolve => setTimeout(resolve, 800));
            if (!nutrients) {
                nutrients = calculateFallbackNutrients(currentSelectedMeal, currentSelectedMeal.servings || 4);
                currentSelectedMeal.nutrients = nutrients;
            }

            const servingsCount = currentSelectedMeal.servings || 4;
            if (heroCalories) {
                heroCalories.textContent = `${nutrients.calories} cal/serving`;
            }
            updateNutritionFactsUI(nutrients, servingsCount);

            logMealBtn.removeAttribute("data-calculating");
            logMealBtn.className = "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all";
            logMealBtn.innerHTML = `
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>
            `;

            openLogMealModal(currentSelectedMeal);
        });
    }
}

function setupAreaFilters() {
    const areaButtons = document.querySelectorAll("#search-filters-section button");

    for (let i = 0; i < areaButtons.length; i++) {
        areaButtons[i].addEventListener("click", async function () {
            for (let j = 0; j < areaButtons.length; j++) {
                areaButtons[j].className = "px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
            }

            this.className = "px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all";

            const buttonText = this.textContent.trim();

            if (buttonText === "All Recipes") {
                const meals = await getMeals();
                displayMeals(meals, "");
            } else if (buttonText === "Egyptain" || buttonText === "Egyptian") {
                const meals = await getMealsByArea("Egyptian");
                displayMeals(meals, "Egyptian");
            }
        });
    }
}

function setupMealSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", async function () {
        const query = this.value.trim();
        if (query.length === 0) {
            displayChickenMeals();
        } else {
            const meals = await searchMeals(query);
            displayMeals(meals, "");
        }
    });
}

function setupViewToggle() {
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");

    if (gridBtn) {
        gridBtn.addEventListener("click", function () {
            setViewMode("grid");
            gridBtn.className = "px-3 py-1.5 bg-white rounded-md shadow-sm";
            gridBtn.innerHTML = '<i class="fa-solid fa-table-cells text-gray-700"></i>';

            if (listBtn) {
                listBtn.className = "px-3 py-1.5";
                listBtn.innerHTML = '<i class="fa-solid fa-list text-gray-500"></i>';
            }

            displayMeals(appState.meals, appState.currentCategory);
        });
    }

    if (listBtn) {
        listBtn.addEventListener("click", function () {
            setViewMode("list");
            listBtn.className = "px-3 py-1.5 bg-white rounded-md shadow-sm";
            listBtn.innerHTML = '<i class="fa-solid fa-list text-gray-700"></i>';

            if (gridBtn) {
                gridBtn.className = "px-3 py-1.5";
                gridBtn.innerHTML = '<i class="fa-solid fa-table-cells text-gray-500"></i>';
            }

            displayMeals(appState.meals, appState.currentCategory);
        });
    }
}

function getProductData(product) {
    const name = product.name || product.product_name || product.title || "Product";
    const brand = product.brand || product.brands || "Brand";
    const barcode = product.barcode || product.code || product.id || "7613034626844";
    const image = product.image || product.thumbnail || product.image_url || product.image_front_small_url || product.image_front_url || product.image_small_url || "";
    const nutriscore = product.nutritionGrade || product.nutriscore || product.nutriscore_grade || product.nutrition_grades || "";
    const nova = product.novaGroup !== undefined ? product.novaGroup : (product.nova || product.nova_group || "");
    const quantity = product.quantity || product.serving_size || "250g";

    let calories = 0;
    if (product.nutrients && product.nutrients.calories !== undefined && product.nutrients.calories !== null) {
        calories = Math.round(Number(product.nutrients.calories));
    } else if (product.calories !== undefined && product.calories !== null) {
        calories = Math.round(Number(product.calories));
    } else if (product.nutriments) {
        const cal = product.nutriments["energy-kcal_100g"] || product.nutriments.energy_kcal || product.nutriments["energy-kcal"] || product.nutriments.energy_kcal_100g || product.nutriments.energy || 0;
        calories = Math.round(Number(cal));
    }

    function extractNutrient(directVal, nutrientKey, nutrimentsKeys, decimals = 1) {
        if (product.nutrients && product.nutrients[nutrientKey] !== undefined && product.nutrients[nutrientKey] !== null) {
            const num = Number(product.nutrients[nutrientKey]);
            return isNaN(num) ? String(product.nutrients[nutrientKey]) : num.toFixed(decimals);
        }
        if (directVal !== undefined && directVal !== null && directVal !== "") {
            const num = Number(directVal);
            return isNaN(num) ? String(directVal) : num.toFixed(decimals);
        }
        if (product.nutriments) {
            for (let i = 0; i < nutrimentsKeys.length; i++) {
                const key = nutrimentsKeys[i];
                if (product.nutriments[key] !== undefined && product.nutriments[key] !== null) {
                    const num = Number(product.nutriments[key]);
                    return isNaN(num) ? String(product.nutriments[key]) : num.toFixed(decimals);
                }
            }
        }
        return decimals === 2 ? "0.00" : "0.0";
    }

    const protein = extractNutrient(product.protein, "protein", ["proteins_100g", "proteins"]);
    const carbs = extractNutrient(product.carbs, "carbs", ["carbohydrates_100g", "carbohydrates"]);
    const fat = extractNutrient(product.fat, "fat", ["fat_100g", "fat"]);
    const sugar = extractNutrient(product.sugar, "sugar", ["sugars_100g", "sugars"]);
    const saturatedFat = extractNutrient(product.saturatedFat || product.saturated_fat, "saturatedFat", [
        "saturated-fat_100g",
        "saturated_fat_100g",
        "saturated-fat",
        "saturated_fat"
    ]);
    const fiber = extractNutrient(product.fiber, "fiber", ["fiber_100g", "fiber"]);
    let salt = extractNutrient(product.salt, "salt", ["salt_100g", "salt"], 2);
    if (salt === "0.00" && product.nutriments) {
        const sodiumVal = product.nutriments["sodium_100g"] || product.nutriments.sodium;
        if (sodiumVal !== undefined && sodiumVal !== null) {
            const num = Number(sodiumVal) * 2.5;
            if (!isNaN(num) && num > 0) {
                salt = num.toFixed(2);
            }
        }
    }

    return {
        name: name,
        brand: brand,
        barcode: barcode,
        image: image,
        nutriscore: nutriscore ? String(nutriscore).toLowerCase().trim() : "",
        nova: (nova !== undefined && nova !== null && nova !== "") ? String(nova).trim() : "",
        quantity: quantity,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        sugar: sugar,
        saturatedFat: saturatedFat,
        fiber: fiber,
        salt: salt,
        rawProduct: product
    };
}

function showProductInitialState() {
    const productsGrid = document.getElementById("products-grid");
    const countElement = document.getElementById("products-count");

    if (countElement) {
        countElement.textContent = "Search for products to see results";
    }

    if (productsGrid) {
        productsGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid fa-box-open text-gray-400 text-3xl"></i>
            </div>
        </div>
        `;
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById("products-grid");
    const countElement = document.getElementById("products-count");

    if (!productsGrid) return;
    let list = products || [];
    let isNutriFiltered = false;
    if (appState.selectedNutriScore !== "") {
        const filtered = [];
        for (let i = 0; i < list.length; i++) {
            const item = getProductData(list[i]);
            if (item.nutriscore === appState.selectedNutriScore) {
                filtered.push(list[i]);
            }
        }
        list = filtered;
        isNutriFiltered = true;
    }

    if (countElement) {
        const totalCount = (!isNutriFiltered && products && products.total !== undefined) ? products.total : list.length;
        if (appState.currentProductSearch && appState.currentProductSearch !== "") {
            countElement.textContent = `Found ${totalCount} products for "${appState.currentProductSearch}"`;
        } else {
            countElement.textContent = `Showing ${list.length} products`;
        }
    }

    productsGrid.innerHTML = "";
    if (list.length === 0) {
        productsGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid fa-barcode text-gray-400 text-3xl"></i>
            </div>
            <p class="text-gray-700 text-lg font-semibold">No products found</p>
            <p class="text-gray-400 text-sm mt-1">Try another search term, category, or barcode number</p>
        </div>
        `;
        return;
    }

    for (let i = 0; i < list.length; i++) {
        const p = getProductData(list[i]);
        let nutriBadgeHtml = "";
        let badgeBg = "bg-slate-400";
        let badgeText = "Nutri-Score Unknown";

        if (p.nutriscore === "a") {
            badgeBg = "bg-green-500";
            badgeText = "Nutri-Score A";
        } else if (p.nutriscore === "b") {
            badgeBg = "bg-lime-500";
            badgeText = "Nutri-Score B";
        } else if (p.nutriscore === "c") {
            badgeBg = "bg-yellow-500";
            badgeText = "Nutri-Score C";
        } else if (p.nutriscore === "d") {
            badgeBg = "bg-orange-500";
            badgeText = "Nutri-Score D";
        } else if (p.nutriscore === "e") {
            badgeBg = "bg-red-500";
            badgeText = "Nutri-Score E";
        }

        nutriBadgeHtml = `
        <div class="absolute top-2 left-2 ${badgeBg} text-white text-xs font-bold px-2 py-1 rounded uppercase">
            ${badgeText}
        </div>
        `;

        let novaBadgeHtml = "";
        if (p.nova && p.nova !== "") {
            let novaBg = "bg-red-500";
            if (p.nova == 1) novaBg = "bg-green-500";
            else if (p.nova == 2) novaBg = "bg-lime-500";
            else if (p.nova == 3) novaBg = "bg-orange-500";
            else if (p.nova == 4) novaBg = "bg-red-500";

            novaBadgeHtml = `
            <div class="absolute top-2 right-2 ${novaBg} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${p.nova}">
                ${p.nova}
            </div>
            `;
        }

        productsGrid.innerHTML += `
        <div
          class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          data-barcode="${p.barcode}">
          <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            ${p.image ? `
            <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              src="${p.image}"
              alt="${p.name}"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
              loading="lazy" />
            <div style="display: none;" class="w-full h-full items-center justify-center">
              <i class="fa-solid fa-box-archive text-gray-400 text-3xl"></i>
            </div>
            ` : `
            <div class="w-full h-full flex items-center justify-center">
              <i class="fa-solid fa-box-archive text-gray-400 text-3xl"></i>
            </div>
            `}
            ${nutriBadgeHtml}
            ${novaBadgeHtml}
          </div>

          <div class="p-4">
            <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
              ${p.brand}
            </p>
            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              ${p.name}
            </h3>

            <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span><i class="fa-solid fa-weight-scale mr-1"></i>${p.quantity}</span>
              <span><i class="fa-solid fa-fire mr-1"></i>${p.calories} kcal/100g</span>
            </div>

            <!-- Mini Nutrition -->
            <div class="grid grid-cols-4 gap-1 text-center">
              <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">${p.protein}g</p>
                <p class="text-[10px] text-gray-500">Protein</p>
              </div>
              <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">${p.carbs}g</p>
                <p class="text-[10px] text-gray-500">Carbs</p>
              </div>
              <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">${p.fat}g</p>
                <p class="text-[10px] text-gray-500">Fat</p>
              </div>
              <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">${p.sugar}g</p>
                <p class="text-[10px] text-gray-500">Sugar</p>
              </div>
            </div>
          </div>
        </div>
        `;
    }

    const productCards = productsGrid.querySelectorAll(".product-card");
    for (let i = 0; i < productCards.length; i++) {
        productCards[i].addEventListener("click", function () {
            const product = list[i];
            if (product) {
                const p = getProductData(product);
                openProductModal(p);
            }
        });
    }
}

function getProductIngredientsList(product, productName) {
    if (product) {
        if (Array.isArray(product.ingredients) && product.ingredients.length > 0) {
            const list = [];
            for (let i = 0; i < product.ingredients.length; i++) {
                const ing = product.ingredients[i];
                const text = typeof ing === "string" ? ing : (ing.text || ing.name || "");
                if (text && text.trim()) list.push(text.trim());
            }
            if (list.length > 0) return list;
        }
        if (typeof product.ingredients_text === "string" && product.ingredients_text.trim()) {
            const parts = product.ingredients_text.split(/[,;\n]+/);
            const list = [];
            for (let i = 0; i < parts.length; i++) {
                const s = parts[i].trim();
                if (s) list.push(s);
            }
            if (list.length > 0) return list;
        }
    }
    return [productName || "Product"];
}

async function openProductModal(p) {
    if (!p) return;
    const ingredients = getProductIngredientsList(p.rawProduct, p.name);
    if (p.calories === 0 && Number(p.protein) === 0) {
        const apiResponse = await analyzeRecipeNutrition(p.name, ingredients);
        if (apiResponse && apiResponse.nutrition) {
            const nut = apiResponse.nutrition;
            if (nut.calories) p.calories = Math.round(Number(nut.calories));
            if (nut.protein) p.protein = Number(nut.protein).toFixed(1);
            if (nut.carbs) p.carbs = Number(nut.carbs).toFixed(1);
            if (nut.fat) p.fat = Number(nut.fat).toFixed(1);
            if (nut.sugar) p.sugar = Number(nut.sugar).toFixed(1);
            if (nut.fiber) p.fiber = Number(nut.fiber).toFixed(1);
        }
    } else {
        analyzeRecipeNutrition(p.name, ingredients);
    }
    const existing = document.getElementById("product-nutrition-modal");
    if (existing) existing.remove();

    let nutriGrade = p.nutriscore ? p.nutriscore.toUpperCase() : "E";
    let nutriColor = "bg-[#e63e11]";
    let nutriTextColor = "text-[#e63e11]";
    let nutriContainer = "bg-[#fef2ee] border border-[#fee2d5]";
    let nutriText = "Bad";

    if (nutriGrade === "A") {
        nutriColor = "bg-[#038141]";
        nutriTextColor = "text-[#038141]";
        nutriContainer = "bg-emerald-50 border border-emerald-100";
        nutriText = "Excellent";
    } else if (nutriGrade === "B") {
        nutriColor = "bg-[#85bb2f]";
        nutriTextColor = "text-[#85bb2f]";
        nutriContainer = "bg-lime-50 border border-lime-100";
        nutriText = "Good";
    } else if (nutriGrade === "C") {
        nutriColor = "bg-[#fecb02]";
        nutriTextColor = "text-[#d97706]";
        nutriContainer = "bg-amber-50 border border-amber-100";
        nutriText = "Average";
    } else if (nutriGrade === "D") {
        nutriColor = "bg-[#ee8100]";
        nutriTextColor = "text-[#ee8100]";
        nutriContainer = "bg-orange-50 border border-orange-100";
        nutriText = "Poor";
    } else if (nutriGrade === "E") {
        nutriColor = "bg-[#e63e11]";
        nutriTextColor = "text-[#e63e11]";
        nutriContainer = "bg-[#fef2ee] border border-[#fee2d5]";
        nutriText = "Bad";
    }

    let novaNum = p.nova || "4";
    let novaColor = "bg-[#e63e11]";
    let novaTextColor = "text-[#e63e11]";
    let novaContainer = "bg-[#fef2ee] border border-[#fee2d5]";
    let novaText = "Ultra-processed";

    if (String(novaNum) === "1") {
        novaColor = "bg-emerald-600";
        novaTextColor = "text-emerald-600";
        novaContainer = "bg-emerald-50 border border-emerald-100";
        novaText = "Unprocessed";
    } else if (String(novaNum) === "2") {
        novaColor = "bg-lime-500";
        novaTextColor = "text-lime-600";
        novaContainer = "bg-lime-50 border border-lime-100";
        novaText = "Processed ingredients";
    } else if (String(novaNum) === "3") {
        novaColor = "bg-amber-500";
        novaTextColor = "text-amber-600";
        novaContainer = "bg-amber-50 border border-amber-100";
        novaText = "Processed";
    } else if (String(novaNum) === "4") {
        novaColor = "bg-[#e63e11]";
        novaTextColor = "text-[#e63e11]";
        novaContainer = "bg-[#fef2ee] border border-[#fee2d5]";
        novaText = "Ultra-processed";
    }

    const proteinNum = parseFloat(p.protein) || 0;
    const carbsNum = parseFloat(p.carbs) || 0;
    const fatNum = parseFloat(p.fat) || 0;
    const sugarNum = parseFloat(p.sugar) || 0;
    const proteinWidth = Math.min(100, Math.max(10, Math.round((proteinNum / 40) * 100)));
    const carbsWidth = Math.min(100, Math.max(15, Math.round((carbsNum / 100) * 100)));
    const fatWidth = Math.min(100, Math.max(15, Math.round((fatNum / 80) * 100)));
    const sugarWidth = Math.min(100, Math.max(15, Math.round((sugarNum / 60) * 100)));
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "product-nutrition-modal";
    modalOverlay.className = "fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4";
    modalOverlay.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 relative" onclick="event.stopPropagation()">
      <!-- Close button X -->
      <button id="product-modal-close-x" type="button" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light leading-none cursor-pointer">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Product Header -->
      <div class="flex items-start gap-4 mb-4 pr-8">
        <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
          ${p.image ? `
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain p-2" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div style="display: none;" class="w-full h-full items-center justify-center">
            <i class="fa-solid fa-box-archive text-gray-400 text-3xl"></i>
          </div>
          ` : `
          <div class="w-full h-full flex items-center justify-center">
            <i class="fa-solid fa-box-archive text-gray-400 text-3xl"></i>
          </div>
          `}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-emerald-600 mb-0.5 truncate">${p.brand}</p>
          <h2 class="text-2xl font-bold text-gray-900 leading-tight mb-2.5 truncate">${p.name}</h2>
          
          <div class="flex items-center gap-3">
            <!-- Nutri-Score Badge -->
            <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border ${nutriContainer}">
              <div class="w-6 h-6 rounded-md ${nutriColor} text-white font-extrabold flex items-center justify-center text-xs">
                ${nutriGrade}
              </div>
              <div class="leading-tight">
                <p class="text-[10px] font-bold ${nutriTextColor} uppercase tracking-tight">Nutri-Score</p>
                <p class="text-[10px] text-gray-500 font-medium">${nutriText}</p>
              </div>
            </div>

            <!-- NOVA Badge -->
            <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border ${novaContainer}">
              <div class="w-6 h-6 rounded-full ${novaColor} text-white font-extrabold flex items-center justify-center text-xs">
                ${novaNum}
              </div>
              <div class="leading-tight">
                <p class="text-[10px] font-bold ${novaTextColor} uppercase tracking-tight">NOVA</p>
                <p class="text-[10px] text-gray-500 font-medium">${novaText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nutrition Facts Card -->
      <div class="border border-emerald-200/80 rounded-2xl p-5 my-4 bg-white shadow-2xs">
        <div class="flex items-center gap-2 mb-2">
          <i class="fa-solid fa-chart-pie text-emerald-600 text-sm"></i>
          <span class="font-bold text-gray-900 text-sm">Nutrition Facts</span>
          <span class="text-xs text-gray-400 font-normal">(per 100g)</span>
        </div>

        <!-- Calories -->
        <div class="text-center my-3">
          <div class="text-4xl font-extrabold text-gray-900 tracking-tight">${p.calories}</div>
          <div class="text-xs text-gray-400 font-medium mt-0.5">Calories</div>
        </div>

        <!-- Macronutrients (4 Columns) -->
        <div class="grid grid-cols-4 gap-3 text-center my-4">
          <!-- Protein -->
          <div>
            <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div class="h-full rounded-full bg-emerald-500" style="width: ${proteinWidth}%"></div>
            </div>
            <p class="text-base font-bold text-emerald-600">${p.protein}g</p>
            <p class="text-xs text-gray-400">Protein</p>
          </div>

          <!-- Carbs -->
          <div>
            <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div class="h-full rounded-full bg-blue-500" style="width: ${carbsWidth}%"></div>
            </div>
            <p class="text-base font-bold text-blue-600">${p.carbs}g</p>
            <p class="text-xs text-gray-400">Carbs</p>
          </div>

          <!-- Fat -->
          <div>
            <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div class="h-full rounded-full bg-purple-600" style="width: ${fatWidth}%"></div>
            </div>
            <p class="text-base font-bold text-purple-600">${p.fat}g</p>
            <p class="text-xs text-gray-400">Fat</p>
          </div>

          <!-- Sugar -->
          <div>
            <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div class="h-full rounded-full bg-orange-500" style="width: ${sugarWidth}%"></div>
            </div>
            <p class="text-base font-bold text-orange-500">${p.sugar}g</p>
            <p class="text-xs text-gray-400">Sugar</p>
          </div>
        </div>

        <!-- Secondary Nutrients (3 Columns) -->
        <div class="grid grid-cols-3 gap-2 text-center pt-3 border-t border-emerald-100 mt-3">
          <div>
            <p class="text-xs font-bold text-gray-800">${p.saturatedFat}g</p>
            <p class="text-[11px] text-gray-400">Saturated Fat</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-800">${p.fiber}g</p>
            <p class="text-[11px] text-gray-400">Fiber</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-800">${p.salt}g</p>
            <p class="text-[11px] text-gray-400">Salt</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 mt-4">
        <button id="product-modal-log-btn" type="button" class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm shadow-xs">
          <i class="fa-solid fa-plus text-xs"></i>
          Log This Food
        </button>
        <button id="product-modal-close-btn" type="button" class="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center transition-colors cursor-pointer text-sm">
          Close
        </button>
      </div>
    </div>
    `;

    document.body.appendChild(modalOverlay);
    const closeBtn = document.getElementById("product-modal-close-btn");
    const closeX = document.getElementById("product-modal-close-x");
    const logBtn = document.getElementById("product-modal-log-btn");

    function closeModal() {
        modalOverlay.remove();
        document.removeEventListener("keydown", handleEsc);
    }

    function handleEsc(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    }

    document.addEventListener("keydown", handleEsc);

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeX) closeX.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) closeModal();
    });

    if (logBtn) {
        logBtn.addEventListener("click", function () {
            addFoodLogItem({
                name: p.name,
                brand: p.brand,
                calories: p.calories,
                protein: p.protein,
                carbs: p.carbs,
                fat: p.fat,
                date: new Date().toLocaleDateString()
            });
            renderFoodLog();
            logBtn.innerHTML = `<i class="fa-solid fa-check text-xs"></i> Added!`;
            logBtn.className = "flex-1 py-3.5 bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm";
            setTimeout(function () {
                closeModal();
                showMealLoggedSuccess(p.name, 1, p.calories);
            }, 350);
        });
    }
}

function updateNutriScoreFilterButtons(selectedGrade) {
    const nutriButtons = document.querySelectorAll(".nutri-score-filter");
    for (let i = 0; i < nutriButtons.length; i++) {
        const btn = nutriButtons[i];
        const grade = (btn.getAttribute("data-grade") || "").toLowerCase();

        let defaultBg = "bg-gray-100 text-gray-700 hover:bg-gray-200";
        if (grade === "a") defaultBg = "bg-green-100 text-green-700 hover:bg-green-200";
        else if (grade === "b") defaultBg = "bg-lime-100 text-lime-700 hover:bg-lime-200";
        else if (grade === "c") defaultBg = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
        else if (grade === "d") defaultBg = "bg-orange-100 text-orange-700 hover:bg-orange-200";
        else if (grade === "e") defaultBg = "bg-red-100 text-red-700 hover:bg-red-200";

        if (grade === selectedGrade.toLowerCase()) {
            let activeBg = "bg-emerald-600 text-white shadow-sm";
            if (grade === "a") activeBg = "bg-green-600 text-white shadow-sm";
            else if (grade === "b") activeBg = "bg-lime-600 text-white shadow-sm";
            else if (grade === "c") activeBg = "bg-yellow-500 text-white shadow-sm";
            else if (grade === "d") activeBg = "bg-orange-500 text-white shadow-sm";
            else if (grade === "e") activeBg = "bg-red-600 text-white shadow-sm";

            btn.className = `nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeBg}`;
        } else {
            btn.className = `nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all ${defaultBg}`;
        }
    }
}

function setupProductCategoryButtons() {
    const categoryButtons = document.querySelectorAll(".product-category-btn");
    for (let i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].addEventListener("click", async function () {
            const rawText = this.textContent.trim();
            const lowerText = rawText.toLowerCase();
            let apiCategory = lowerText;
            if (lowerText.includes("breakfast")) {
                apiCategory = "breakfast-cereals";
            } else if (lowerText.includes("dairy")) {
                apiCategory = "dairies";
            } else if (lowerText.includes("snacks")) {
                apiCategory = "snacks";
            } else if (lowerText.includes("beverages")) {
                apiCategory = "beverages";
            } else if (lowerText.includes("desserts")) {
                apiCategory = "desserts";
            }

            const searchInput = document.getElementById("product-search-input");
            const barcodeInput = document.getElementById("barcode-input");
            if (searchInput) searchInput.value = "";
            if (barcodeInput) barcodeInput.value = "";

            const countElement = document.getElementById("products-count");
            if (countElement) countElement.textContent = "Searching...";
            const productsGrid = document.getElementById("products-grid");
            if (productsGrid) {
                productsGrid.innerHTML = `
                <div class="col-span-full flex items-center justify-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
                `;
            }

            setSelectedNutriScore("");
            updateNutriScoreFilterButtons("");

            let products = await getProductsByCategory(apiCategory);
            if (!products || products.length === 0) {
                products = await getProductsByCategory(lowerText);
            }

            setProducts(products, products.total, rawText);
            displayProducts(appState.products);
        });
    }
}

async function executeProductSearch() {
    const input = document.getElementById("product-search-input");
    if (!input) return;

    const query = input.value.trim();
    if (query === "") return;

    const barcodeInput = document.getElementById("barcode-input");
    if (barcodeInput) barcodeInput.value = "";

    const countElement = document.getElementById("products-count");
    if (countElement) {
        countElement.textContent = "Searching...";
    }
    const productsGrid = document.getElementById("products-grid");
    if (productsGrid) {
        productsGrid.innerHTML = `
        <div class="col-span-full flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
        `;
    }

    setSelectedNutriScore("");
    updateNutriScoreFilterButtons("");
    const products = await searchProducts(query);
    setProducts(products, products.total, query);
    displayProducts(appState.products);
}

async function executeBarcodeLookup() {
    const input = document.getElementById("barcode-input");
    if (!input) return;

    const barcode = input.value.trim();
    if (barcode === "") return;

    const searchInput = document.getElementById("product-search-input");
    if (searchInput) searchInput.value = "";

    const countElement = document.getElementById("products-count");
    if (countElement) {
        countElement.textContent = "Looking up barcode...";
    }

    const productsGrid = document.getElementById("products-grid");
    if (productsGrid) {
        productsGrid.innerHTML = `
        <div class="col-span-full flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
        `;
    }

    setSelectedNutriScore("");
    updateNutriScoreFilterButtons("");
    const products = await getProductByBarcode(barcode);
    setProducts(products, products.total, barcode);
    displayProducts(appState.products);
}

function setupProductScanner() {
    const searchBtn = document.getElementById("search-product-btn");
    const searchInput = document.getElementById("product-search-input");

    if (searchBtn) {
        searchBtn.addEventListener("click", executeProductSearch);
    }
    if (searchInput) {
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                executeProductSearch();
            }
        });
    }

    const barcodeBtn = document.getElementById("lookup-barcode-btn");
    const barcodeInput = document.getElementById("barcode-input");

    if (barcodeBtn) {
        barcodeBtn.addEventListener("click", executeBarcodeLookup);
    }
    if (barcodeInput) {
        barcodeInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                executeBarcodeLookup();
            }
        });
    }

    const nutriButtons = document.querySelectorAll(".nutri-score-filter");
    for (let i = 0; i < nutriButtons.length; i++) {
        nutriButtons[i].addEventListener("click", function () {
            const grade = (this.getAttribute("data-grade") || "").toLowerCase();
            setSelectedNutriScore(grade);
            updateNutriScoreFilterButtons(grade);
            displayProducts(appState.products);
        });
    }

    setupProductCategoryButtons();
    showProductInitialState();
}

function renderFoodLog() {
    const listContainer = document.getElementById("logged-items-list");
    const clearBtn = document.getElementById("clear-foodlog");
    if (!listContainer) return;

    const items = loadFoodLog();
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        totalCalories += parseFloat(item.calories) || 0;
        totalProtein += parseFloat(item.protein) || 0;
        totalCarbs += parseFloat(item.carbs) || 0;
        totalFat += parseFloat(item.fat) || 0;
    }

    totalCalories = Math.round(totalCalories);
    totalProtein = Math.round(totalProtein);
    totalCarbs = Math.round(totalCarbs);
    totalFat = Math.round(totalFat);

    const progressCards = document.querySelectorAll("#foodlog-today-section .grid > div");
    for (let i = 0; i < progressCards.length; i++) {
        const card = progressCards[i];
        const labelElem = card.querySelector(".font-semibold");
        const label = labelElem ? labelElem.textContent.toLowerCase() : "";
        const valSpan = card.querySelector(".text-gray-500");
        const bar = card.querySelector("[class*='h-2.5 rounded-full']");

        if (label.includes("calories")) {
            if (valSpan) valSpan.textContent = `${totalCalories} / 2000 kcal`;
            const pct = Math.min(100, Math.round((totalCalories / 2000) * 100));
            if (bar) bar.style.width = `${pct}%`;
        } else if (label.includes("protein")) {
            if (valSpan) valSpan.textContent = `${totalProtein} / 50 g`;
            const pct = Math.min(100, Math.round((totalProtein / 50) * 100));
            if (bar) bar.style.width = `${pct}%`;
        } else if (label.includes("carbs")) {
            if (valSpan) valSpan.textContent = `${totalCarbs} / 250 g`;
            const pct = Math.min(100, Math.round((totalCarbs / 250) * 100));
            if (bar) bar.style.width = `${pct}%`;
        } else if (label.includes("fat")) {
            if (valSpan) valSpan.textContent = `${totalFat} / 65 g`;
            const pct = Math.min(100, Math.round((totalFat / 65) * 100));
            if (bar) bar.style.width = `${pct}%`;
        }
    }

    const dateElem = document.getElementById("foodlog-date");
    if (dateElem) {
        dateElem.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric"
        });
    }

    if (clearBtn) {
        clearBtn.style.display = items.length > 0 ? "inline-block" : "none";
    }

    const titleHeading = document.querySelector("#foodlog-today-section h4");
    if (titleHeading) {
        titleHeading.textContent = `Logged Items (${items.length})`;
    }

    renderWeeklyChart();
    if (items.length === 0) {
        listContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500">
            <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
            <p class="font-medium">No meals logged today</p>
            <p class="text-sm">Add meals from the Meals page or scan products</p>
        </div>
        `;
        return;
    }
    listContainer.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isRecipe = item.brand === "Recipe" || item.brand === "Chicken" || item.brand === "Beef" || item.brand === "Dessert" || !item.brand;
        const iconClass = isRecipe ? "fa-utensils" : "fa-cookie";
        const brandText = item.brand || "Food";

        listContainer.innerHTML += `
        <div class="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold shrink-0">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div>
                    <h5 class="font-bold text-gray-900 text-sm">${item.name}</h5>
                    <p class="text-xs text-gray-500">${brandText} • ${item.date || "Today"}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <span class="font-bold text-emerald-600 text-sm">${item.calories} kcal</span>
                    <p class="text-[10px] text-gray-500 font-medium">P: ${item.protein}g | C: ${item.carbs}g | F: ${item.fat}g</p>
                </div>
                <button type="button" class="delete-log-item text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer" data-index="${i}" title="Remove item">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            </div>
        </div>
        `;
    }

    const deleteButtons = listContainer.querySelectorAll(".delete-log-item");
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"), 10);
            removeFoodLogItem(index);
            renderFoodLog();
        });
    }
}

function renderNativeWeeklyChart(container, days, weeklyCalories, currentDayIndex, todayCalories) {
    if (!container) return;
    let maxCal = 2500;
    for (let i = 0; i < weeklyCalories.length; i++) {
        if (weeklyCalories[i] > maxCal) {
            maxCal = Math.round(weeklyCalories[i] * 1.15);
        }
    }

    const goalPercent = Math.min(92, Math.max(10, Math.round((2000 / maxCal) * 100)));

    let barsHTML = "";
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const cal = weeklyCalories[i];
        const isToday = (i === currentDayIndex);
        const heightPercent = cal > 0 ? Math.min(100, Math.max(6, Math.round((cal / maxCal) * 100))) : 4;

        const barColor = isToday ? "bg-emerald-600 shadow-md shadow-emerald-200" : "bg-emerald-400 hover:bg-emerald-500";
        const valText = cal > 0 ? `${cal}` : "0";
        const valClass = isToday ? "font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]" : "text-[11px] font-medium text-gray-500";

        barsHTML += `
        <div class="flex-1 flex flex-col items-center h-full justify-end group relative z-20">
            <!-- Calorie Value label -->
            <span class="${valClass} mb-1.5 transition-all text-center select-none">${valText}</span>
            <!-- Bar -->
            <div class="w-full max-w-[42px] ${barColor} rounded-t-lg transition-all duration-300" style="height: ${heightPercent}%;"></div>
        </div>
        `;
    }

    let labelsHTML = "";
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const isToday = (i === currentDayIndex);
        const dayLabelClass = isToday ? "font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full text-[11px]" : "font-medium text-gray-500 text-xs";
        labelsHTML += `
        <div class="flex-1 text-center">
            <span class="${dayLabelClass} select-none">${day}</span>
        </div>
        `;
    }

    container.innerHTML = `
    <div class="h-64 w-full bg-white rounded-xl p-4 flex flex-col justify-between border border-gray-100 shadow-xs">
        <!-- Chart Header & Legend -->
        <div class="flex items-center justify-between pb-1 border-b border-gray-100">
            <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1.5">
                    <span class="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span>
                    <span class="font-medium text-gray-700">Calories Intake</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="w-4 h-0.5 border-t-2 border-dashed border-orange-500 inline-block"></span>
                    <span class="font-medium text-gray-700">Daily Goal (2,000 kcal)</span>
                </div>
            </div>
            <div class="flex items-center gap-1.5">
                <span class="text-[11px] text-gray-500">Today's Total:</span>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">${todayCalories} kcal</span>
            </div>
        </div>

        <!-- Chart Bars Container with Goal Line -->
        <div class="relative flex-1 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            <!-- 2000 kcal Goal Line -->
            <div class="absolute left-0 right-0 border-t-2 border-dashed border-orange-400/80 pointer-events-none z-10" style="bottom: ${goalPercent}%;">
                <span class="absolute -top-3.5 right-1 text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">Goal 2,000 kcal</span>
            </div>
            ${barsHTML}
        </div>

        <!-- Days of Week Row -->
        <div class="flex justify-between items-center px-1 pt-2 border-t border-gray-100">
            ${labelsHTML}
        </div>
    </div>
    `;
}

function renderWeeklyChart() {
    const chartContainer = document.getElementById("weekly-chart");
    if (!chartContainer) return;
    const foodlogSection = document.getElementById("foodlog-section");
    const isVisible = foodlogSection && foodlogSection.style.display !== "none";
    const items = loadFoodLog();
    let todayCalories = 0;
    for (let i = 0; i < items.length; i++) {
        todayCalories += parseFloat(items[i].calories) || 0;
    }
    todayCalories = Math.round(todayCalories);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const currentDayIndex = (new Date().getDay() + 6) % 7;
    const weeklyCalories = [1850, 2100, 1950, 2200, 1800, 2050, 1900];
    weeklyCalories[currentDayIndex] = todayCalories > 0 ? todayCalories : 0;
    if (typeof Plotly !== "undefined" && typeof Plotly.newPlot === "function") {
        if (!isVisible) return;
        chartContainer.innerHTML = "";
        chartContainer.className = "w-full overflow-hidden";
        chartContainer.style.height = "250px";
        chartContainer.style.minHeight = "250px";
        chartContainer.style.maxHeight = "250px";

        const caloriesTrace = {
            x: days,
            y: weeklyCalories,
            type: "bar",
            name: "Calories Intake",
            marker: {
                color: days.map(function (_, idx) {
                    return idx === currentDayIndex ? "#059669" : "#10b981";
                }),
                borderRadius: 6
            },
            hovertemplate: "%{x}: %{y} kcal<extra></extra>"
        };

        const goalTrace = {
            x: days,
            y: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
            type: "scatter",
            mode: "lines",
            name: "Daily Goal (2000 kcal)",
            line: {
                color: "#f97316",
                width: 2,
                dash: "dot"
            },
            hoverinfo: "skip"
        };

        const layout = {
            height: 250,
            autosize: false,
            margin: { t: 30, r: 20, l: 45, b: 35 },
            showlegend: true,
            legend: {
                orientation: "h",
                x: 0.5,
                xanchor: "center",
                y: 1.16,
                font: { family: "inherit", size: 12, color: "#4b5563" }
            },
            xaxis: {
                tickfont: { family: "inherit", size: 12, color: "#6b7280" },
                fixedrange: true
            },
            yaxis: {
                tickfont: { family: "inherit", size: 11, color: "#6b7280" },
                gridcolor: "#f3f4f6",
                zeroline: false,
                fixedrange: true,
                range: [0, Math.max(2500, Math.round(todayCalories * 1.25))]
            },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent"
        };

        const config = {
            responsive: true,
            displayModeBar: false
        };

        Plotly.newPlot("weekly-chart", [caloriesTrace, goalTrace], layout, config);
    } else {
        chartContainer.innerHTML = "";
        chartContainer.className = "w-full overflow-hidden";
        chartContainer.style.height = "250px";
        renderNativeWeeklyChart(chartContainer, days, weeklyCalories, currentDayIndex, todayCalories);
    }
}

function openCustomFoodModal() {
    const existing = document.getElementById("custom-food-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "custom-food-modal";
    modal.className = "fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4";

    modal.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative" onclick="event.stopPropagation()">
      <button id="close-custom-modal-x" type="button" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light cursor-pointer">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold">
          <i class="fa-solid fa-pencil"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900">Custom Food Entry</h3>
          <p class="text-xs text-gray-500">Log custom food and nutrients</p>
        </div>
      </div>

      <div class="space-y-3.5 mb-6">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Food Name</label>
          <input id="custom-food-name" type="text" placeholder="e.g. Oatmeal with Berries" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Calories (kcal)</label>
            <input id="custom-food-calories" type="number" min="0" placeholder="e.g. 350" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Protein (g)</label>
            <input id="custom-food-protein" type="number" min="0" step="0.1" placeholder="e.g. 15" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Carbs (g)</label>
            <input id="custom-food-carbs" type="number" min="0" step="0.1" placeholder="e.g. 45" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Fat (g)</label>
            <input id="custom-food-fat" type="number" min="0" step="0.1" placeholder="e.g. 8" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button id="submit-custom-food" type="button" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm">
          <i class="fa-solid fa-plus text-xs"></i> Add Food
        </button>
        <button id="cancel-custom-food" type="button" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center transition-colors cursor-pointer text-sm">
          Cancel
        </button>
      </div>
    </div>
    `;

    document.body.appendChild(modal);

    function closeCustomModal() {
        modal.remove();
    }

    const closeX = document.getElementById("close-custom-modal-x");
    const cancelBtn = document.getElementById("cancel-custom-food");
    const submitBtn = document.getElementById("submit-custom-food");

    if (closeX) closeX.addEventListener("click", closeCustomModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeCustomModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) closeCustomModal();
    });

    if (submitBtn) {
        submitBtn.addEventListener("click", function () {
            const nameInput = document.getElementById("custom-food-name");
            const calInput = document.getElementById("custom-food-calories");
            const protInput = document.getElementById("custom-food-protein");
            const carbsInput = document.getElementById("custom-food-carbs");
            const fatInput = document.getElementById("custom-food-fat");

            const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Custom Meal";
            const cal = calInput ? (parseFloat(calInput.value) || 0) : 0;
            const prot = protInput ? (parseFloat(protInput.value) || 0) : 0;
            const carbs = carbsInput ? (parseFloat(carbsInput.value) || 0) : 0;
            const fat = fatInput ? (parseFloat(fatInput.value) || 0) : 0;

            addFoodLogItem({
                name: name,
                brand: "Custom",
                calories: Math.round(cal),
                protein: Number(prot.toFixed(1)),
                carbs: Number(carbs.toFixed(1)),
                fat: Number(fat.toFixed(1)),
                date: new Date().toLocaleDateString()
            });

            renderFoodLog();
            closeCustomModal();
            showMealLoggedSuccess(name, 1, Math.round(cal));
        });
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const mealsSearch = document.getElementById("search-filters-section");
    const mealCategories = document.getElementById("meal-categories-section");
    const allRecipes = document.getElementById("all-recipes-section");
    const mealDetails = document.getElementById("meal-details");
    const productsSection = document.getElementById("products-section");
    const foodlogSection = document.getElementById("foodlog-section");
    const headerTitle = document.querySelector("#header h1");
    const headerSubtitle = document.querySelector("#header p");

    if (productsSection) productsSection.style.display = "none";
    if (foodlogSection) foodlogSection.style.display = "none";
    if (mealDetails) mealDetails.style.display = "none";
    if (navLinks[0]) {
        navLinks[0].addEventListener("click", function (e) {
            e.preventDefault();
            setCurrentPage("meals");

            if (mealsSearch) mealsSearch.style.display = "block";
            if (mealCategories) mealCategories.style.display = "block";
            if (allRecipes) allRecipes.style.display = "block";
            if (productsSection) productsSection.style.display = "none";
            if (foodlogSection) foodlogSection.style.display = "none";
            if (mealDetails) mealDetails.style.display = "none";

            if (headerTitle) headerTitle.textContent = "Meals & Recipes";
            if (headerSubtitle) headerSubtitle.textContent = "Discover delicious and nutritious recipes tailored for you";

            navLinks[0].className = "nav-link flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg transition-all font-semibold";
            if (navLinks[1]) navLinks[1].className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium";
            if (navLinks[2]) navLinks[2].className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium";
        });
    }

    if (navLinks[1]) {
        navLinks[1].addEventListener("click", function (e) {
            e.preventDefault();
            setCurrentPage("products");

            if (mealsSearch) mealsSearch.style.display = "none";
            if (mealCategories) mealCategories.style.display = "none";
            if (allRecipes) allRecipes.style.display = "none";
            if (productsSection) productsSection.style.display = "block";
            if (foodlogSection) foodlogSection.style.display = "none";
            if (mealDetails) mealDetails.style.display = "none";

            if (headerTitle) headerTitle.textContent = "Product Scanner";
            if (headerSubtitle) headerSubtitle.textContent = "Search packaged foods by name or barcode";

            if (navLinks[0]) navLinks[0].className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium";
            navLinks[1].className = "nav-link flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg transition-all font-semibold";
            if (navLinks[2]) navLinks[2].className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium";
            const searchInput = document.getElementById("product-search-input");
            const barcodeInput = document.getElementById("barcode-input");
            if (searchInput) searchInput.value = "";
            if (barcodeInput) barcodeInput.value = "";
            setSelectedNutriScore("");
            updateNutriScoreFilterButtons("");
            showProductInitialState();
        });
    }

    if (navLinks[2]) {
        navLinks[2].addEventListener("click", function (e) {
            e.preventDefault();
            setCurrentPage("foodlog");

            if (mealsSearch) mealsSearch.style.display = "none";
            if (mealCategories) mealCategories.style.display = "none";
            if (allRecipes) allRecipes.style.display = "none";
            if (productsSection) productsSection.style.display = "none";
            if (foodlogSection) foodlogSection.style.display = "block";
            if (mealDetails) mealDetails.style.display = "none";

            if (headerTitle) headerTitle.textContent = "Daily Food Log";
            if (headerSubtitle) headerSubtitle.textContent = "Track and monitor your daily nutrition intake";

            if (navLinks[0]) navLinks[0].className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium";
            if (navLinks[1]) navLinks[1].className = "nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all font-medium";
            navLinks[2].className = "nav-link flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg transition-all font-semibold";

            renderFoodLog();
            setTimeout(function () {
                renderWeeklyChart();
                if (typeof Plotly !== "undefined") {
                    const chart = document.getElementById("weekly-chart");
                    if (chart && chart.data) {
                        Plotly.Plots.resize("weekly-chart");
                    }
                }
            }, 80);
        });
    }

    const clearBtn = document.getElementById("clear-foodlog");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            clearFoodLog();
            renderFoodLog();
            setTimeout(function () {
                renderWeeklyChart();
                if (typeof Plotly !== "undefined") {
                    const chart = document.getElementById("weekly-chart");
                    if (chart && chart.data) {
                        Plotly.Plots.resize("weekly-chart");
                    }
                }
            }, 80);
        });
    }

    window.addEventListener("resize", function () {
        if (typeof Plotly !== "undefined") {
            const chart = document.getElementById("weekly-chart");
            if (chart && chart.data) {
                Plotly.Plots.resize("weekly-chart");
            }
        }
    });

    const quickLogButtons = document.querySelectorAll(".quick-log-btn");
    for (let i = 0; i < quickLogButtons.length; i++) {
        quickLogButtons[i].addEventListener("click", function () {
            const text = this.textContent.toLowerCase();
            if (text.includes("scan product")) {
                if (navLinks[1]) navLinks[1].click();
            } else if (text.includes("log a meal")) {
                if (navLinks[0]) navLinks[0].click();
            } else if (text.includes("custom entry")) {
                openCustomFoodModal();
            }
        });
    }
}


function setupMobileSidebar() {
    const headerMenuBtn = document.getElementById("header-menu-btn");
    const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const navLinks = document.querySelectorAll("#sidebar .nav-link");

    function openSidebar() {
        if (sidebar) sidebar.classList.add("open");
        if (sidebarOverlay) sidebarOverlay.classList.add("active");
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove("open");
        if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    }

    if (headerMenuBtn) {
        headerMenuBtn.addEventListener("click", function () {
            if (sidebar && sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener("click", function () {
            closeSidebar();
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", function () {
            closeSidebar();
        });
    }

    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function () {
            closeSidebar();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeSidebar();
        }
    });
}

function showLoadingOverlay() {
    const loadingOverlay = document.getElementById("app-loading-overlay");
    if (loadingOverlay) {
        loadingOverlay.style.display = "flex";
        loadingOverlay.style.opacity = "1";
        loadingOverlay.style.pointerEvents = "auto";
    }
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById("app-loading-overlay");
    if (loadingOverlay && loadingOverlay.style.display !== "none") {
        loadingOverlay.style.opacity = "0";
        loadingOverlay.style.pointerEvents = "none";
        setTimeout(function () {
            loadingOverlay.style.display = "none";
        }, 500);
    }
}


async function init() {
    showLoadingOverlay();
    setupNavigation();
    setupMobileSidebar();
    setupMealSearch();
    setupAreaFilters();
    setupViewToggle();
    setupMealDetailsHandlers();
    setupProductScanner();
    renderFoodLog();

    const startTime = Date.now();
    Promise.all([loadCategories(), displayChickenMeals()]).then(function () {
        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, 800 - elapsedTime);
        setTimeout(hideLoadingOverlay, remainingDelay);
    });

    setTimeout(hideLoadingOverlay, 2500);
}

init();
