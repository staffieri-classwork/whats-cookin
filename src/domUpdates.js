console.log("here is the dom updates thingy");

function getUsers() {
  const userDataApi = "https:fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData"
  const promise = fetch(userDataApi)
    .then (response => response.json())
    // .then(users => users.wcUsersData.find((user) => user.id === userID))
  return promise;
}

function getRecipes() {
  const recipeDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData"
  const promise = fetch(recipeDataApi)
    .then(response => response.json())
    // .then((recipe) => pickles = recipe.recipeData)
    // .then(() => console.log(createRecipeObject(pickles)))
  return promise;
}

function getIngredients() {
  const ingredientDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData"
  const promise = fetch(ingredientDataApi)
    .then(response => response.json())
    // .then((ingredient) => ingredient.ingredientsData
  return promise;
}

function onLoadContent() {
  let promise1 = Pantry.getIngredients()
  let promise2 = Recipe.getRecipes()
  let promise3 = User.getUsers(userId)
  Promise.all([promise1, promise2, promise3])
    .then(values => {
      // .then((ingredient) => ingredient.ingredientsData
      // .then((recipe) => pickles = recipe.recipeData)
      // .then(users => users.wcUsersData.find((user) => user.id === userID))

      //DOM shenanigans
    })
}





export default domUpdates;
