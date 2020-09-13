class User {
  constructor(user) {
    // console.log(user)
    this.id = user.id;
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }
  saveRecipe(recipe) {
    if(!this.favoriteRecipes.includes(recipe)){
      this.favoriteRecipes.push(recipe);
    }
  }

  removeRecipe(recipe) {
    let i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1);
  }

  // favouriteRecipe() {
  //   if (event.target.className === "card-apple-icon") {
  //       let cardId = parseInt(event.target.closest(".recipe-card").id)
  //       if (!this.favoriteRecipes.includes(cardId)) {
  //         event.target.src = "../images/apple-logo.png";//invoke DOM function
  //         this.saveRecipe(cardId);
  //       } else {
  //         event.target.src = "../images/apple-logo-outline.png"; //invoke DOM function
  //         this.removeRecipe(cardId);
  //       }
  //     } else if (event.target.id === "exit-recipe-btn") {
  //       exitRecipe();
  //     } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
  //       openRecipeInfo(event);
  //     }
  // } can. can you add addEventListeners to class methods. i actually. have no idea??

  decideToCook(recipe) {
    this.recipesToCook.push(recipe);
  }
  filterRecipes(type) {
    return this.favoriteRecipes.filter(recipe => recipe.type.includes(type));
  }
  searchForRecipe(keyword) {
    return this.favoriteRecipes.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));
  }
}

module.exports = User;
