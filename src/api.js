let api = {
  getUsers() {
    const userDataApi = "https:fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData"
    const promise = fetch(userDataApi)
      .then (response => response.json())
    return promise;
  },

  getRecipes() {
    const recipeDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData"
    const promise = fetch(recipeDataApi)
      .then(response => response.json())
    return promise;
  },

  getIngredients() {
    const ingredientDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData"
    const promise = fetch(ingredientDataApi)
      .then(response => response.json())
    return promise;
  },
}

export default api;
