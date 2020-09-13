import $ from 'jquery';
// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientData from './data/ingredient-data';
import domUpdates from './domUpdates.js'
import User from './user';
import Recipe from './recipe';
import './css/base.scss';
import './css/styles.scss';

let pickles;
let dillPickles;
let newRecipeObjects;

let userID = Math.floor((Math.random() * 50) + 1);

// function getUsers() {
//   const userDataApi = "https:fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData"
//   const promise = fetch(userDataApi)
//     .then (response => response.json())
//     // .then(users => users.wcUsersData.find((user) => user.id === userID))
//   return promise;
// }
//
// function getRecipes() {
//   const recipeDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData"
//   const promise = fetch(recipeDataApi)
//     .then(response => response.json())
//     // .then((recipe) => pickles = recipe.recipeData)
//     // .then(() => console.log(createRecipeObject(pickles)))
//   return promise;
// }
//
// function getIngredients() {
//   const ingredientDataApi = "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData"
//   const promise = fetch(ingredientDataApi)
//     .then(response => response.json())
//     // .then((ingredient) => ingredient.ingredientsData
//   return promise;
// }

// Promise.all([userDataApi , ingredientDataApi])
//   .then((values) => {
//     values[0].pantry.forEach(ingredient => {
//       let currentIngredient = values[1].find(ing => ingredient.ingredient === ing.id)
//       ingredient.name = currentIngredient.name
//     })
//   });


let main = document.querySelector("main");
let tagList = document.querySelector(".tag-list");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let pantryInfo = [];
let recipes = [];
let menuOpen = false;
let user;


window.addEventListener("load", createCards);
window.addEventListener("load", findAllTags);
window.addEventListener("load", generateUser);
allRecipesBtn.addEventListener("click", showAllRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);

// GENERATE A USER ON LOAD
function generateUser() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  let firstName = user.name.split(" ")[0];// here up one function
  welcomeMessage(firstName)
  // let welcomeMsg = `
  //   <div class="welcome-msg">
  //     <h1>Welcome ${firstName}!</h1>
  //   </div>`;
  // document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
  //   welcomeMsg); //here up render function
  findPantryInfo();//wat do?
}

function welcomeMessage(userName) {
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${userName}!</h1>
    </div>`;
  document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
    welcomeMsg);
  return welcomeMsg
}

//GENERAL HELPER FUNCTIONS
function createRecipeObject(recipes) { //Still needed? Input? where does this live?
  let newRecipeObjects = recipes.map(recipe => new Recipe(recipe));
  return newRecipeObjects
}

function capitalize(words) { //stay for Scripts
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

// CREATE RECIPE CARDS
function createCards() {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo); // here up one function
    checkNameLength(recipeInfo, shortRecipeName)
    // if (recipeInfo.name.length > 40) {
    //   shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    // } // one function to check and handle recipe name length
    addToDom(recipeInfo, shortRecipeName) // moved to domUpdates.js
  });
}

function checkNameLength(recipeData, recipeName) {
  if (recipeData.name.length > 40) {
    recipeName = recipeData.name.substring(0, 40) + "...";
  } // one function to check and handle recipe name length
}

// FILTER BY RECIPE TAGS
function findAllTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  listTags(tags);
} //this function actually gets all the tags from every recipe and displays em to the DOM! do need

function findTaggedRecipes(selected) { //ive changed my mind, we might need this.
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

function filterRecipes(filtered) { //findByIngredient in recipe class?
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  hideUnselectedRecipes(foundRecipes)
}

// FAVORITE RECIPE FUNCTIONALITY

function addToMyRecipes() { // this is User Class behavior //split DOM
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "../images/apple-logo.png";//invoke DOM function
      user.saveRecipe(cardId);
    } else {
      event.target.src = "../images/apple-logo-outline.png"; //invoke DOM function
      user.removeRecipe(cardId);
    }
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

function isDescendant(parent, child) { //eh? important? Yes. related to addToMyRecipes()
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
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
//     <button id="exit-recipe-btn">X</button>
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
// function generateIngredients(recipe) { // maybe same as calculateIngredientsCost in pantry?
//   return recipe && recipe.ingredients.map(i => {
//     return `${capitalize(i.name)} (${i.quantity.amount} ${i.quantity.unit})`
//   }).join(", ");
// }

// function generateInstructions(recipe) { // recipe class behavior?
//   let instructionsList = "";
//   let instructions = recipe.instructions.map(i => {
//     return i.instruction
//   }); Here down all DOM? -------
//   instructions.forEach(i => {
//     instructionsList += `<li>${i}</li>`
//   });
//   fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
//   fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
// }

// function exitRecipe() { moved to domUpdates.js
//   while (fullRecipeInfo.firstChild &&
//     fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
//   fullRecipeInfo.style.display = "none";
//   document.getElementById("overlay").remove();
// }

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
// function pressEnterSearch(event) {
//   event.preventDefault();
//   searchRecipes();
// }
//
// function searchRecipes() {
//   showAllRecipes();
//   let searchedRecipes = recipeData.filter(recipe => {
//     return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
//   });
//   filterNonSearched(createRecipeObject(searchedRecipes));
// }
//
// function filterNonSearched(filtered) {
//   let found = recipes.filter(recipe => {
//     let ids = filtered.map(f => f.id);
//     return !ids.includes(recipe.id)
//   })
//   hideUnselectedRecipes(found);
// } //most of these belong to classes

// function toggleMenu() { Move to where the DOM lives.
//   var menuDropdown = document.querySelector(".drop-menu");
//   menuOpen = !menuOpen;
//   if (menuOpen) {
//     menuDropdown.style.display = "block";
//   } else {
//     menuDropdown.style.display = "none";
//   }
// }
//
// function showAllRecipes() {
//   recipes.forEach(recipe => {
//     let domRecipe = document.getElementById(`${recipe.id}`);
//     domRecipe.style.display = "block";
//   });
//   showWelcomeBanner();
// }

// CREATE AND USE PANTRY
// function findPantryInfo() { belongs to class user/pantry!
//   user.pantry.forEach(item => {
//     let itemInfo = ingredientsData.find(ingredient => {
//       return ingredient.id === item.ingredient;
//     });
//     let originalIngredient = pantryInfo.find(ingredient => {
//       if (itemInfo) {
//         return ingredient.name === itemInfo.name;
//       }
//     });
//     if (itemInfo && originalIngredient) {
//       originalIngredient.count += item.amount;
//     } else if (itemInfo) {
//       pantryInfo.push({name: itemInfo.name, count: item.amount});
//     }
//   });
  // displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
// }

// function displayPantryInfo(pantry) { //Move to domUpdates.js
//   pantry.forEach(ingredient => {
//     let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
//       <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
//     document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
//       ingredientHtml);
//   });
// }

// function findCheckedPantryBoxes() { //A CSS thing
//   let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
//   let pantryCheckboxInfo = Array.from(pantryCheckboxes)
//   let selectedIngredients = pantryCheckboxInfo.filter(box => {
//     return box.checked;
//   })
//   showAllRecipes(); //could go either way *shrug*
//   if (selectedIngredients.length > 0) {
//     findRecipesWithCheckedIngredients(selectedIngredients);
//   }
// }

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
