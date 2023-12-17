import view from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class bookmarkView extends view {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = `No bookmark yet, fine a nice recipe and bookmark it.`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);

    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
}

export default new bookmarkView();
