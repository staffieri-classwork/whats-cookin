let domUpdates = {

 addToDom(recipeInfo, shortRecipeName, main) {
  let cardHtml = `
    <article tabindex="1" class="recipe-card" id=${recipeInfo.id}>
      <h3 maxlength="40">${shortRecipeName}</h3>
      <div class="card-photo-container">
        <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
        <div class="text">
          <div>Click for Instructions</div>
        </div>
      </div>
      <h4>${recipeInfo.tags[0]}</h4>
      <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
    </article>`
  main.insertAdjacentHTML("beforeend", cardHtml);
},

capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
},

 listTags(allTags) {
  let tagList = document.querySelector(".tag-list");
  allTags.forEach(tag => {
    let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${this.capitalize(tag)}</label></li>`;
    tagList.insertAdjacentHTML("beforeend", tagHtml);
  });
},

 hideUnselectedRecipes(foundRecipes) {
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
},

 openRecipeInfo(event) {
  let fullRecipeInfo = document.querySelector(".recipe-instructions");
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  generateRecipeTitle(recipe, generateIngredients(recipe));
  addRecipeImage(recipe);
  generateInstructions(recipe);
  fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
},

 generateRecipeTitle(recipe, ingredients) {
  let fullRecipeInfo = document.querySelector(".recipe-instructions");
  let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 id="recipe-title">${recipe.name}</h3>
    <h4>Ingredients</h4>
    <p>${ingredients}</p>`
  fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
  //put above shit into an if conditional to prevent more than one resippy from being clicked.
},

 addRecipeImage(recipe) {
  document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
},

 exitRecipe() {
  let fullRecipeInfo = document.querySelector(".recipe-instructions");
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
},

 showMyRecipesBanner() {
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "block";
},

 showWelcomeBanner() {
  document.querySelector(".welcome-msg").style.display = "flex";
  document.querySelector(".my-recipes-banner").style.display = "none";
},

 toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display = "block";
  } else {
    menuDropdown.style.display = "none";
  }
},

 showAllRecipes() {
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  showWelcomeBanner();
},

displayPantryInfo(pantry) {
  pantry.forEach(ingredient => {
    let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
      <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
      ingredientHtml);
  });
},

}

export default domUpdates;
