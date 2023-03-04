import { async } from 'regenerator-runtime';
import { API_URL, KEY, RESULT_PER_PAGE, CART_SERVINGS } from './config';
import { AJAX } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    pageNum: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
  addToCart: [],
};
// if (module.hot) {
//   module.hot.accept();
// }

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    cartServings: CART_SERVINGS,
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // console.log(state.recipe);
    const isBookmarked = state.bookmarks.some(bookmark => bookmark.id === id);
    state.recipe.bookmarked = isBookmarked ? true : false;
  } catch (err) {
    // console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
        cartServings: CART_SERVINGS,
      };
    });
    // debugger;
    // console.log(state.search.results);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const searchResultsPerPage = function (pageNum = state.search.pageNum) {
  state.search.pageNum = pageNum;
  const start = (pageNum - 1) * state.search.resultsPerPage;
  const end = pageNum * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // Updating ingredients quantity
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // Updating servings
  state.recipe.servings = newServings;
};
export const updateServingsAddToCart = function (recipe, newServings) {
  const id = recipe.getAttribute('href').slice(1);
  const resultsIndex = state.search.results.findIndex(el => el.id === id);
  const bookmarkIndex = state.bookmarks.findIndex(el => el.id === id);
  // console.log(state.search.results[ind], newServings);
  if (resultsIndex !== -1)
    state.search.results[resultsIndex].cartServings = newServings;
  if (bookmarkIndex !== -1)
    state.bookmarks[bookmarkIndex].cartServings = newServings;

  const addToCartIndex = state.addToCart.findIndex(el => el.id === id);
  console.log(
    state.search.results[resultsIndex],
    state.bookmarks[bookmarkIndex]
  );

  recipe = state.search.results[resultsIndex] ?? state.bookmarks[bookmarkIndex];
  // addToCartIndex === -1 && newServings > 0
  //   ? state.addToCart.push(recipe)
  //   : (state.addToCart[addToCartIndex].cartServings = newServings);

  if (newServings > 0) {
    if (addToCartIndex === -1) {
      state.addToCart.push(recipe);
    } else {
      state.addToCart[addToCartIndex].cartServings = newServings;
    }
  } else {
    state.addToCart.splice(addToCartIndex, 1);
  }
};
const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmarks
  state.bookmarks.push(recipe);

  // Mark bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Unmark bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredients format!!!. Please use correct format'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    // console.log(data);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// console.log(state.bookmarks);
