import View from './view';
import icons from 'url:../../img/icons.svg';
import addToCartBtnView from './addToCartBtnView';

class PreviewView extends View {
  _parentElement = '';
  _generatedMarkup(recipe) {
    // debugger;
    const id = window.location.hash.slice(1);
    const addToCartBtn = addToCartBtnView.render(recipe, false);

    return `
         <li class="preview">
            <a class="preview__link ${
              recipe.id === id ? 'preview__link--active' : ''
            }" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                <div class="preview__user-generated ${
                  recipe.key ? '' : 'hidden'
                }">
                    <svg>
                       <use href="${icons}#icon-user"></use>
                     </svg>
                  </div>
                  <div class="add-to-cart">
                  ${addToCartBtn}
                  </div>
            
              </div>
            </a>
          </li>
    `;
  }
}

export default new PreviewView();
