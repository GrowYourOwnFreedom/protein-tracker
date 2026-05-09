function fetchLocalIngredients(baseIngredients) {
    const savedIngredients =
        JSON.parse(localStorage.getItem("proteinTrackerIngredients")) ??
        baseIngredients;
    return savedIngredients;
}

function fetchLocalEntries() {
    const savedEntries =
        JSON.parse(localStorage.getItem("proteinTrackerEntries")) ?? [];
    return savedEntries;
}

function updateLocalEntries(entries) {
    const proteinTrackerEntries = JSON.stringify(entries);
    localStorage.setItem("proteinTrackerEntries", proteinTrackerEntries);
}

function updateLocalIngredients(ingredients) {
    const proteinTrackerIngredients = JSON.stringify(ingredients);
    localStorage.setItem(
        "proteinTrackerIngredients",
        proteinTrackerIngredients,
    );
}

function updateLocalCalorieLimit(calories) {
    localStorage.setItem("proteinTrackerCalorieLimit", calories);
}

function fetchLocalCalorieLimit() {
    const calories = localStorage.getItem("proteinTrackerCalorieLimit") ?? "";

    return calories;
}

function updateLocalProteinTarget(proteinTarget) {
    localStorage.setItem("proteinTrackerProteinTarget", proteinTarget);
}

function fetchLocalProteinTarget() {
    const savedProteinTarget =
        localStorage.getItem("proteinTrackerProteinTarget") ?? "";

    return savedProteinTarget;
}

export {
    fetchLocalEntries as fetchEntries,
    fetchLocalIngredients as fetchIngredients,
    updateLocalEntries as updateEntries,
    updateLocalIngredients as updateIngredients,
    fetchLocalCalorieLimit as fetchCalorieLimit,
    updateLocalCalorieLimit as updateCaloreLimit,
    updateLocalProteinTarget as updateProteinTarget,
    fetchLocalProteinTarget as fetchProteinTarget,
};
