let api = {
  getUsers() {
    const userDataApi = "https:fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData"
    const promise = fetch(userDataApi)
      .then (response => response.json())
      // .then(users => users.wcUsersData.find((user) => user.id === userID))
    return promise;
  },

  getRecipes() {
    const recipeDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData"
    const promise = fetch(recipeDataApi)
      .then(response => response.json())
      // .then((recipe) => pickles = recipe.recipeData)
      // .then(() => console.log(createRecipeObject(pickles)))
    return promise;
  },

  getIngredients() {
    const ingredientDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData"
    const promise = fetch(ingredientDataApi)
      .then(response => response.json())
      // .then((ingredient) => ingredient.ingredientsData
    return promise;
  },
}

export default api;
