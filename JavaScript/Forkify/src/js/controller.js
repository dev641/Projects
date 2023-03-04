import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RecipeView from './views/recipeView.js';
import addRecipeView from './views/addRecipeView.js';
import * as modal from './modal.js';
import searchViews from './views/searchViews.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import bookmarksView from './views/bookmarksView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import addToCartBtnView from './views/addToCartBtnView.js';
import previewView from './views/previewView.js';
import addToCartView from './views/addToCartView.js';

///////////////////////////////////////
// console.log('TEST');

const controlRecipes = async function () {
  try {
    //
    // 1.) Loading recipe
    const id = window.location.hash.slice(1);

    if (!id) return;
    // console.log(id);
    resultsView.update(modal.searchResultsPerPage());
    RecipeView.renderSpineer();

    await modal.loadRecipe(id);

    // 2.) Rendering recipe

    RecipeView.render(modal.state.recipe);
    bookmarksView.update(modal.state.bookmarks);
    //test
    // controlServings();
  } catch (err) {
    // console.error(`${err}`);
    RecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1.) get Search query
    const query = searchViews.getQuery();
    // debugger;
    // 2.) loading search
    await modal.loadSearchResults(query);
    // console.log(modal.state.search.results);

    resultsView.renderSpineer();
    // await modal.loadSearchResults(query);

    // 3.)Rendering Search Results
    resultsView.render(modal.searchResultsPerPage(1));

    // 4.) Render pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1.)Rendering New Search Results
  resultsView.render(modal.searchResultsPerPage(goToPage));

  // 2.) Render new pagination
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  modal.updateServings(newServings);

  // recipeView.render(modal.state.recipe);
  // virtual dom / update
  recipeView.update(modal.state.recipe);
};

const controlBookmark = function () {
  //1.)  Add/Remove Bookmarks
  const isBookmarked = modal.state.recipe.bookmarked;

  !isBookmarked
    ? modal.addBookmark(modal.state.recipe)
    : modal.deleteBookmark(modal.state.recipe.id);
  // console.log(modal.state.recipe);

  //2.) update Recipe View
  RecipeView.update(modal.state.recipe);

  // 3.) Render Bookmarks
  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  // console.log(modal.state.bookmarks);
  // debugger;
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner

    addRecipeView.renderSpineer();
    // Upload Recipe
    await modal.uploadRecipe(newRecipe);
    // console.log(modal.state.recipe);

    // Render recipe
    recipeView.render(modal.state.recipe);
    // show Successful message
    addRecipeView.renderMessage();

    // render Bookmark
    bookmarksView.render(modal.state.bookmarks);

    // Change url ID
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    // close form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const clear = function () {
  localStorage.clear('bookmarks');
};

const controlAddToCart = function (recipe, newServings) {
  // const id = recipe.getAttribute('href').slice(1);
  // console.log(recipe, id, newServings);
  // debugger;
  modal.updateServingsAddToCart(recipe, newServings);
  // const nd = modal.state.search.results.findIndex(el => el.id === id);
  // console.log(state.search.results[ind], newServings);
  const pageNum = modal.state.search.pageNum;
  // console.log(pageNum);

  // addToCartBtnView.findParentAndUpdate(recipe);

  resultsView.update(modal.searchResultsPerPage(pageNum));
  bookmarksView.update(modal.state.bookmarks);
  debugger;

  addToCartView.render(modal.state.addToCart);
};

// clear();
const init = function () {
  bookmarksView.addRenderhandler(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addBookmarkHandler(controlBookmark);
  searchViews.addSearchhandler(controlSearchResults);
  resultsView.addHandlerUpdateServingsAddToCart(controlAddToCart);
  bookmarksView.addHandlerUpdateServingsAddToCart(controlAddToCart);
  // addToCartView.addAddToCartHandler(controlCart);
  addToCartView.addHandlerUpdateServingsAddToCart(controlAddToCart);
  paginationView.addClickHandler(controlPagination);
  addRecipeView.addHandlerSubmitForm(controlAddRecipe);
};

init();
