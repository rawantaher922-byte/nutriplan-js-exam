
export const appState = {
    currentPage: "meals",
    viewMode: "grid",
    meals: [],
    categories: [],
    currentCategory: "",
    currentArea: "",
    products: [],
    totalProducts: 0,
    productCategories: [],
    currentProductSearch: "",
    currentProductCategory: "",
    selectedNutriScore: "",
    foodLog: [],
};

export function setCurrentPage(page) {
    appState.currentPage = page;
}

export function setViewMode(mode) {
    appState.viewMode = mode;
}

export function setMeals(meals, category) {
    appState.meals = meals || [];
    if (category !== undefined) {
        appState.currentCategory = category;
    }
}

export function setProducts(products, total, searchLabel) {
    appState.products = products || [];
    appState.totalProducts = total !== undefined ? total : (products ? products.length : 0);
    if (searchLabel !== undefined) {
        appState.currentProductSearch = searchLabel;
    }
}

export function setSelectedNutriScore(grade) {
    appState.selectedNutriScore = grade || "";
}


export function loadFoodLog() {
    const data = localStorage.getItem("nutriplan_food_log");
    if (data) {
        appState.foodLog = JSON.parse(data);
    } else {
        appState.foodLog = [];
    }
    return appState.foodLog;
}

export function addFoodLogItem(item) {
    appState.foodLog.push(item);
    localStorage.setItem("nutriplan_food_log", JSON.stringify(appState.foodLog));
}

export function removeFoodLogItem(index) {
    if (index >= 0 && index < appState.foodLog.length) {
        appState.foodLog.splice(index, 1);
        localStorage.setItem("nutriplan_food_log", JSON.stringify(appState.foodLog));
    }
}

export function clearFoodLog() {
    appState.foodLog = [];
    localStorage.removeItem("nutriplan_food_log");
}

