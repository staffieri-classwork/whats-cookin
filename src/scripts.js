import $ from 'jquery';
// import './images/apple-logo-outline.png'

// import users from './data/users-data';
// import recipeData from './data/recipe-data';
// import ingredientData from './data/ingredient-data';
import User from './user';
import Recipe from './recipe';
import './css/styles.scss';

import domUpdates from './domUpdates'
import api from './api'

let newRecipeObjects;

let users;
let recipeData;
let ingredientData;
let menuOpen = false;
let pantryInfo = [];
let recipes = [];
let user;

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let hamburgerMenue = document.querySelector(".burger");
let greenForkSpoonX = document.querySelector(".x-no-hover");
let listMenue = document.querySelector(".list-menue");
let hatMenue = document.querySelector(".hat-menue");
let greyFiltered = document.querySelector(".whole-filter-section");


window.addEventListener("load", onLoadContent);
allRecipesBtn.addEventListener("click", showAllRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
greenForkSpoonX.addEventListener("click", hamburgerMenueClose);
hamburgerMenue.addEventListener("click", hamburgerMenueOpen);
searchForm.addEventListener("submit", pressEnterSearch);

let userID = Math.floor((Math.random() * 50) + 1);

function onLoadContent() {
  let promise1 = api.getUsers()
  let promise2 = api.getRecipes()
  let promise3 = api.getIngredients()
  Promise.all([promise1, promise2, promise3])
    .then(values => {
      console.log(values)
      users = values[0].wcUsersData;
      recipeData = values[1].recipeData;
      ingredientData = values[2].ingredientsData;
      createCards();
      findTags();
      generateUser();
    })
}

// GENERATE A USER ON LOAD
function generateUser() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  let firstName = user.name.split(" ")[0];// here up one function
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
    welcomeMsg); //here up render function
  findPantryInfo();//wat do?
}

//GENERAL HELPER FUNCTIONS
function createRecipeObject(recipes) { //Still needed? Input? where does this live?
  let newRecipeObjects = recipes.map(recipe => new Recipe(recipe));
  return newRecipeObjects
}

// CREATE RECIPE CARDS
function createCards() {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo); // here up one function
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    } // one function to check and handle recipe name length
    domUpdates.addToDom(recipeInfo, shortRecipeName, main) // moved to domUpdates.js
  });
}

// function addToDom(recipeInfo, shortRecipeName) { // moved to domUpdates.js
//   let cardHtml = `
//     <div class="recipe-card" id=${recipeInfo.id}>
//       <h3 maxlength="40">${shortRecipeName}</h3>
//       <div class="card-photo-container">
//         <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
//         <div class="text">
//           <div>Click for Instructions</div>
//         </div>
//       </div>
//       <h4>${recipeInfo.tags[0]}</h4>
//       <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
//     </div>`
//   main.insertAdjacentHTML("beforeend", cardHtml);
// }

// FILTER BY RECIPE TAGS
function findTags() { //recipe.findByTag() Same same
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  domUpdates.listTags(tags);//wat do?
}

function capitalize(words) { //stay for Scripts
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) { // possibly combine with findByTag and add to recipe class
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showAllRecipes();
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  domUpdates.hideUnselectedRecipes(foundRecipes)
}

// FAVORITE RECIPE FUNCTIONALITY

function addToMyRecipes() {
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png"; //toggle apples method
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    }
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    domUpdates.openRecipeInfo(event, recipeData, ingredientData);
  }
}

function isDescendant(parent, child) {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function showSavedRecipes() {
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
// function openRecipeInfo(event) { // moved to domUpdates.js
//   fullRecipeInfo.style.display = "inline";
//   let recipeId = event.path.find(e => e.id).id;
//   let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
//   generateRecipeTitle(recipe, generateIngredients(recipe));
//   addRecipeImage(recipe);
//   generateInstructions(recipe);
//   fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
// }

// function generateRecipeTitle(recipe, ingredients) { // move to domUpdates.js
//   let recipeTitle = `
//     <button id="exit-recipe-btn">recipeX</button>
//     <h3 id="recipe-title">${recipe.name}</h3>
//     <h4>Ingredients</h4>
//     <p>${ingredients}</p>`
//   fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
//   //put above shit into an if conditional to prevent more than one resippy from being clicked.
// }

// function addRecipeImage(recipe) { See above
//   document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
// }
//maybe displayNameOnCards rename?

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// TOGGLE DISPLAYS // All moved to domUpdates.js
// function showMyRecipesBanner() {
//   document.querySelector(".welcome-msg").style.display = "none";
//   document.querySelector(".my-recipes-banner").style.display = "block";
// }
//
// function showWelcomeBanner() {
//   document.querySelector(".welcome-msg").style.display = "flex";
//   document.querySelector(".my-recipes-banner").style.display = "none";
// }

// SEARCH RECIPES // most of these belong to classes. User split searching and DOM display
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  showAllRecipes();
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(createRecipeObject(searchedRecipes));
}
//
// function filterNonSearched(filtered) {
//   let found = recipes.filter(recipe => {
//     let ids = filtered.map(f => f.id);
//     return !ids.includes(recipe.id)
//   })
//   hideUnselectedRecipes(found);
// } //most of these belong to classes

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display = "block";
  } else {
    menuDropdown.style.display = "none";
  }
}

function showAllRecipes() {
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  domUpdates.showWelcomeBanner();
}

// CREATE AND USE PANTRY
function findPantryInfo() {
  user.pantry.forEach(item => {
    let itemInfo = ingredientData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    }
  });
  domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

// function displayPantryInfo(pantry) { //Move to domUpdates.js
//   pantry.forEach(ingredient => {
//     let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
//       <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
//     document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
//       ingredientHtml);
//   });
// }

function findCheckedPantryBoxes() { //A CSS thing
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  showAllRecipes(); //could go either way *shrug*
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

// function findRecipesWithCheckedIngredients(selected) { // Scripts
//   let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
//   let ingredientNames = selected.map(item => {
//     return item.id;
//   })
//   recipes.forEach(recipe => {
//     let allRecipeIngredients = [];
//     recipe.ingredients.forEach(ingredient => {
//       allRecipeIngredients.push(ingredient.name);
//     });
//     if (!recipeChecker(allRecipeIngredients, ingredientNames)) { //DOM
//       let domRecipe = document.getElementById(`${recipe.id}`);
//       domRecipe.style.display = "none";
//     }
//   })
// }

// Mobile View //

function hamburgerMenueOpen() {
  greenForkSpoonX.classList.remove("clicked-unhidden");
  listMenue.classList.remove("clicked-unhidden");
  hatMenue.classList.remove("clicked-unhidden");
  greyFiltered.classList.remove("clicked-unhidden");
}

function hamburgerMenueClose() {
  greenForkSpoonX.classList.add("clicked-unhidden");
  listMenue.classList.add("clicked-unhidden");
  hatMenue.classList.add("clicked-unhidden");
  greyFiltered.classList.add("clicked-unhidden");
}
