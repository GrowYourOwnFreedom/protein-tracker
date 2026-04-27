function getProteinEfficiency(calories, protein) {
    if (!calories || !protein) {
        return 0;
    }
    return (protein / calories) * 100;
}
 export {getProteinEfficiency}