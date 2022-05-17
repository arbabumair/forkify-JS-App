import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg'; //V2


class ResultView extends View {
_parentElement = document.querySelector('.results');
_errorMessage = 'We could not find that recipe. Please Try again!';
_sucessMessage = '';

_generateMarkup(){
    
    return this._data.map(result  => previewView.render(result, false)).join('');
    }
}

export default new ResultView();