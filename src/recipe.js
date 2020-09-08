class Recipe {
  constructor(recipe) {
    this.name = recipe.name;
    this.id = recipe.id;
    this.image = recipe.image;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
    this.tags = recipe.tags;
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

  getInstructions() {
    let instructions = this.instructions.map(recipe => {
      return recipe.instruction
    });
    return instructions
  }
  //only need to return the getInstructions this.instructions
  // make a find by tag
  // just do the classes and the testign for now get the data working then fix the display  

};

module.exports = Recipe;
