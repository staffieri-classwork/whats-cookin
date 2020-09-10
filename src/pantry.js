class Pantry {
  constructor(user) {
    this.ingredients = user.pantry;
  }

checkIngredients(user, recipe) {
  let ingredientsNeeded = recipe.ingredients.reduce((ingredientsNeeded ,ingredientForRecipe) =>{
    let amountNeeded = ingredientForRecipe.quantity.amount
    let idNeeded = ingredientForRecipe.id
    let pantryInventory = user.pantry
    let item = pantryInventory.find((item) => {
      return idNeeded === item.ingredient
    });
    if(item === undefined || amountNeeded > item.amount){
      let amountOnHand = item && item.amount || 0
       ingredientsNeeded.push({name: ingredientForRecipe.name, amountNeeded: ingredientForRecipe.quantity.amount - amountOnHand})
    }
    return ingredientsNeeded
  }, [])
  return ingredientsNeeded
}

}


module.exports = Pantry;
