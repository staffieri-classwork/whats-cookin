export class Recipe {
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
    return this.instructions
  };

  findByTag(dataFile, inputTag) {
    let filteredAnswers = dataFile.filter((recipe) => {
      return recipe.tags.includes(inputTag)
    })
    return filteredAnswers
  }

  findByIngredient(dataFile, inputIngredient) {
    return dataFile.reduce((sortedByIngredient, recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if(ingredient.name.toLowerCase().includes(inputIngredient.toLowerCase())){
          sortedByIngredient.push(recipe)
        }
      });
      return sortedByIngredient
    }, [])
  }

};


module.exports = Recipe;
