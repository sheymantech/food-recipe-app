import * as model from './module.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeview from './views/recipeviews.js';
import { async } from 'regenerator-runtime';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';

import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }
// import { repeat } from 'core-js/library/core/string';

const recipeContainer = document.querySelector('.recipe');

//https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    recipeview.renderSpinner();

    resultView.update(model.getSearchResultPage());

    // loading recipe
    await model.loadRecipe(id);

    const { recipe } = model.state;

    // const recipeView = new recipeview(model.state.recipe)
    //rendering recipe

    recipeview.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    console.log(err);
    recipeview.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResult(query);

    // console.log(model.state.search.results);
    resultView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);

    // resultView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // console.log(model.state.search.results);
  resultView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);
  //update the view
  // recipeview.render(model.state.recipe);
  recipeview.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update the bookmark
  recipeview.update(model.state.recipe);

  //render the bookmark

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAadRecipe = async function (newRecipe) {
  try {
    // show loading spinner

    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // console.log(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render recipe

    recipeview.render(model.state.recipe);

    //render bookmark view

    bookmarkView.render(model.state.bookmarks)

    // change the id in url
    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    setTimeout(function () {
      addRecipeView.toogleView();
    }, MODAL_CLOSE_SEC * 1000);

    //close form window
  } catch (err) {
    console.error(err);

    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeview.addHandlerRender(controlRecipe);
  recipeview.addHandlerUpdateServings(controlServings);
  recipeview.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAadRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

// window.addEventListener('hashchange', controlRecipe);

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
