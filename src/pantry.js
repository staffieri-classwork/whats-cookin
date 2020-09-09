class Pantry {
  constructor(user) {
    this.ingredients = user.pantry;
  }

  checkIngredients(user, recipe) {
    // console.log(user.pantry, recipe.ingredients)
    //so we have the stuff we need
    recipe.ingredients.forEach(pantryItem => {
      console.log(pantryItem.id)
    })
  }
}







module.exports = Pantry;
