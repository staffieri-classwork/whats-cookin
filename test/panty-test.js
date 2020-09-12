import { expect } from 'chai';

import Pantry from '../src/pantry';
import Recipe from '../src/recipe';
import User from '../src/user';
import userData from '../src/data/users-data';
import ingredientData from '../src/data/sample-ingredient-data';
import recipeData from '../src/data/sample-recipe-data';

describe('Pantry', () => {
  let user;
  let pantry;
  let recipe;
  let recipe2;

  beforeEach(() => {
    user = new User(userData[0]);
    pantry = new Pantry(user, ingredientData);
    recipe = new Recipe(recipeData[0]);
    recipe2 = new Recipe(recipeData[1]);
  });

  it('is a function', () =>{
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', () => {
    expect(pantry).to.be.an.instanceof(Pantry);
  });

  it('should have all of a given user\'s pantry items', () => {
    expect(pantry.ingredients).to.equal(user.pantry)
  })

  it('should check to make sure the user has enough ingredients for a recipe in their pantry', () => {
    expect(pantry.checkIngredients(user, recipe)[0]).to.deep.equal({
      name: 'sea salt',
      amountNeeded: 24,
      id: 1012047,
      unitsNeeded: 'servings'
    })
  })

})

// console.log(pantry.determineCost(user, recipe))
// console.log(pantry.addNecessay(user, recipe))



//
