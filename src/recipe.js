class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
  }

  calculateIngredientsCost(ingredientData) {
    let totalCost = this.ingredients.reduce((finalCost, ingredient) => {
      ingredientData.forEach(data => {
        if (ingredient.id === data.id) {
          finalCost += ingredient.quantity.amount * data.estimatedCostInCents
        }
      })
      return finalCost
    }, 0)
    return  `$${totalCost / 100}`
  }

};

module.exports = Recipe;
