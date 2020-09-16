class Pantry {
  constructor(user, ingredientsData) {
    this.ingredients = user.pantry;
    this.ingredientsData = ingredientsData;
  }

  checkIngredients(user, recipe) {
    let ingredientsNeeded = recipe.ingredients.reduce((ingredientsNeeded , ingredientForRecipe) =>{
      let amountNeeded = ingredientForRecipe.quantity.amount
      let idNeeded = ingredientForRecipe.id
      let pantryInventory = user.pantry
      let item = pantryInventory.find((item) => {
        return idNeeded === item.ingredient
      });
      if (item === undefined || amountNeeded > item.amount){
        let amountOnHand = item && item.amount || 0
        let needAmount = ingredientForRecipe.quantity.amount - amountOnHand
         ingredientsNeeded.push(
           {name: ingredientForRecipe.name,
             amountNeeded: needAmount,
             id: ingredientForRecipe.id,
             unitsNeeded: ingredientForRecipe.quantity.unit,
           })
      }
      return ingredientsNeeded
    }, [])
    return ingredientsNeeded
  }

  determineCost(user, recipe) {
    let neededIngredient = this.checkIngredients(user, recipe)
    let estimatedCostNeeded = neededIngredient.reduce((costNeeded, item) => {
      let lookedUpItem = this.ingredientsData.find((ingredient) => {
        return ingredient.id === item.id
      })
      if(neededIngredient !== []) {
        let itemCost = (item.amountNeeded * lookedUpItem.estimatedCostInCents) / 100
        costNeeded.push(`We need to get ${item.amountNeeded} more ${item.unitsNeeded} ${item.name} that will roughly cost $${itemCost} for the recipe`)
      } else if (costNeeded === []) {
        costNeeded.push("We have the ingredients to cook the recipe")
      }
      return costNeeded
    }, [])
    return estimatedCostNeeded.join('; also ')
  }
}


module.exports = Pantry;
