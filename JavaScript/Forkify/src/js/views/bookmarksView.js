import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'No Bookmark fount yet. Please find a good recipe and bookmark it :)';
  _message = '';

  addRenderhandler(handler) {
    window.addEventListener('load', handler);
  }
  _generatedMarkup(recipes) {
    // console.log(recipes);
    return recipes
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  // _generatedMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   return `
  //        <li class="preview">
  //           <a class="preview__link ${
  //             result.id === id ? 'preview__link--active' : ''
  //           }" href="#${result.id}">
  //             <figure class="preview__fig">
  //               <img src="${result.image}" alt="${result.title}" />
  //             </figure>
  //             <div class="preview__data">
  //               <h4 class="preview__title">${result.title}</h4>
  //               <p class="preview__publisher">${result.publisher}</p>

  //             </div>
  //           </a>
  //         </li>
  //   `;
  // }
}

export default new BookmarksView();
