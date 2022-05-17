import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config";
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const {recipe} = data.data;
    
        return {
          id : recipe.id,
          title: recipe.title,
          ingredients:recipe.ingredients,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          
          ...(recipe.key && { key: recipe.key}) //shortcircuting
            
        };
}

export const loadRecipe = async function(id){
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
         state.recipe = createRecipeObject(data);
        
        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        
    } catch(err){
        //exporting Error to ViewRecipe
        console.error(`Error: ${err}`);
        throw err;
    }
    
};

export const loadSearchResults = async function (query) {
    try{
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id : rec.id,
                title: rec.title,
                publisher: rec.publisher,
                sourceUrl: rec.source_url,
                image: rec.image_url,
                ...(rec.key && { key: rec.key}) //shortcircuting
            };
        });
        state.search.page = 1;
        

    }catch(err){
        console.error(`Error: ${err}`);
        throw err;
    }
};

export const getSearchResultPage = function(page = state.search.page){
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage; //0
    const end = page * state.search.resultsPerPage; //9
    return state.search.results.slice(start,end);


};

export const updateServings =  function(newServings){
      state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
     });

     state.recipe.servings = newServings;
};

//Storing bookmark in localStorage
const presistBookmark = function () {
    localStorage.setItem('bookmark', JSON.stringify(state.bookmarks))
}

//Bookmark method
export const addBookmark = function(recipe) {
    
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if(recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
    
    presistBookmark();
}

export const deleteBookmark = function(id) {
    //create index and delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //unbookmarked recipe
    if(id === state.recipe.id)
        state.recipe.bookmarked = false;
    presistBookmark
};

const init = function() {

    const storage = localStorage.getItem('bookmark');
    if(storage) state.bookmarks = JSON.parse(storage); //convert strng back to obj

};

init();

 const clearBookmarks = function (){
     localStorage.clear('bookmarks');
 };
//  clearBookmarks();

export const uploadRecipe = async function(newRecipe) {
    try{
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if(ingArr.length !== 3 ) throw new Error (
            'Wrong ingrident format! please use correct format'
            );

        const [quantity, unit, description] = ingArr;

        return {quantity: quantity ? +quantity : null, unit, description};    
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
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    } catch(err) {
        throw err;
    }

    

};
