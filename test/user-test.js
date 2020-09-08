import { expect } from 'chai';

import User from '../src/user';
import users from '../src/data/users-data';

describe('User', () =>{
  let user;
  let userInfo;
  let recipe;
  let recipe2;

  beforeEach(() =>{
    userInfo = users[0];
    user = new User(userInfo)

    recipe = {name: 'Chicken Parm', type: ['italian', 'dinner'], ingredients: ['chicken', 'parm', 'bread crumbs', 'eggs']};
    recipe2 = {name: 'Scrambled Eggs', type: ['breakfast'], ingredients: ['eggs', 'milk', 'pepper']};
  });

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', () => {
    expect(user.id).to.eq(1);
  });

  it('should initialize with a name', () => {
    expect(user.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', () => {
    expect(user.pantry[0].ingredient).to.eq(11477);
  });

  it('should initialize with an empty favoriteRecipes array', () => {
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should initialize with an empty recipesToCook array', () => {
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should be able to save a recipe to favoriteRecipes', () => {
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes[0].name).to.equal('Chicken Parm');
  });

  it('should not be allowed to have duplicates in favoriteRecipes', () => {
    user.saveRecipe(recipe);
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes.length).to.deep.equal(1);
  });

  it('should be able to remove a recipe from favoriteRecipes', () => {
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes[0].name).to.equal('Chicken Parm');
    user.removeRecipe(recipe);
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should be able to decide to cook a recipe', () => {
    user.decideToCook(recipe);
    expect(user.recipesToCook[0].name).to.equal('Chicken Parm');
  });

  it('should be able to filter recipes by type', () => {
    user.saveRecipe(recipe);
    user.saveRecipe(recipe2);
    expect(user.filterRecipes('italian')).to.deep.equal([recipe]);
  });

  it('should return nothing if the searched item is not in type', () => {
    user.saveRecipe(recipe2);
    expect(user.filterRecipes('italian')).to.deep.equal([]);
  })

  it('should be able to search recipes by name', () => {
    user.saveRecipe(recipe);
    user.saveRecipe(recipe2);
    expect(user.searchForRecipe('Chicken Parm')).to.deep.equal([recipe]);
  });

  it('should be able to search for recipes by ingredient', () => {
    user.saveRecipe(recipe);
    user.saveRecipe(recipe2);
    expect(user.searchForRecipe('eggs')).to.deep.equal([recipe, recipe2]);
  })

  it('should be able to search for recipes by ingredient', () => {
    user.saveRecipe(recipe);
    user.saveRecipe(recipe2);
    expect(user.searchForRecipe('chicken')).to.deep.equal([recipe]);
  })

  it('should be able to search for recipes by another ingredient', () => {
    user.saveRecipe(recipe);
    user.saveRecipe(recipe2);
    expect(user.searchForRecipe('banana')).to.deep.equal([]);
  })

});
