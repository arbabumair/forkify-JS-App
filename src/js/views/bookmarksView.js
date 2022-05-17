import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg'; //V2


class BookmarksView extends View {
_parentElement = document.querySelector('.bookmarks__list');
_errorMessage = 'No bookmarks yet. Find a nice recipe to Bookmark it ;)';
_sucessMessage = '';

addHandlerRender(handler) {
    window.addEventListener('load', handler);
}

_generateMarkup(){
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}

export default new BookmarksView();