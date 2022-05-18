import * as model from  './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable'; //polifying rest of all the things
import 'regenerator-runtime/runtime'; //used for polifying Async await
import { async } from 'regenerator-runtime';


// if(module.hot){
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//01 Loading Recipe 
// console.log('test');

const controlRecipes = async  function (){
  try{
    const id = window.location.hash.slice(1);

    //guard claw
    if(!id) return;
    recipeView.renderSpinner();

    //1 update RESULT VIEW mark as selected search results
    resultsView.update(model.getSearchResultPage());

    //2 updating bookmarks View
    bookmarksView.update(model.state.bookmarks);

    //3 Loading Recipe
    await model.loadRecipe(id);

    //4 Rendering Recipe
     recipeView.render(model.state.recipe);

    
    
  }catch(err){
      //redirecting error from model to recipeView via Controller
    recipeView.renderError(); 
    console.error(err);
  }

};

const controlSearchResults = async function(){
  try{
    //Loading Spinner
    resultsView.renderSpinner();

    //1 get Search Query
    const query = searchView.getQuery();

    //3Guard clause on Search Query
    if(!query) return;
    
    //3load search results
    await model.loadSearchResults(query);

      //4rendering results
      // resultsView.render(model.state.search.results)
      resultsView.render(model.getSearchResultPage());

    //4 Render Pagination button
    paginationView.render(model.state.search);
 
  }catch(err) {
    console.log(err);
  }
};


const controlPagination = function(gotoPage) {
      //rendering new results
      // resultsView.render(model.state.search.results)
      resultsView.render(model.getSearchResultPage(gotoPage));

    //4 Render new Pagination button
    paginationView.render(model.state.search);
}

 const controlServings = function(newServings) {

  //Update Recipe Servings (in state)
  model.updateServings(newServings);

  //Updating the recipe View
  // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);

 }

 const controlAddBookmark = function(){
  //add/remove bookmark
  if(!model.state.recipe.bookmarked) 
    model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);

  //update recipeView
  recipeView.update(model.state.recipe);

  //renderbookmark
  bookmarksView.render(model.state.bookmarks);
  
  
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{

    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //sucess Message
    addRecipeView.renderMessage();

    //render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);  

    
    //close form window
    setTimeout(function(){
       addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  }catch(err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
    
   
}

const init = function(){
  //publisher-subscriber partner
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddbookmark(controlAddBookmark);
  searchView.addhandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  
};



init();