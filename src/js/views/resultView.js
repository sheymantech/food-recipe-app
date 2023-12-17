import view from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class resultView extends view {
  _parentElement = document.querySelector('.results');

  _errorMessage = `No recipes found for your search, please try again`;
  _message = '';

  _generateMarkup() {
    // console.log(this._data);

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
