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

function updateLocalEntries(entries){
     const proteinTrackerEntries = JSON.stringify(entries);
        localStorage.setItem("proteinTrackerEntries", proteinTrackerEntries)
}
function updateLocalIngredients(ingredients){
     const proteinTrackerIngredients = JSON.stringify(ingredients);
        localStorage.setItem(
            "proteinTrackerIngredients",
            proteinTrackerIngredients,
        );
}

export {
    fetchLocalEntries as fetchEntries,
    fetchLocalIngredients as fetchIngredients,
    updateLocalEntries as updateEntries,
    updateLocalIngredients as updateIngredients
};
