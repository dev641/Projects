import View from './view';
import icons from 'url:../../img/icons.svg';
import { CART_SERVINGS } from '../config';

class AddToCartBtnView extends View {
  _parentElement = document.querySelector('.add-to-cart');

  findParentAndUpdate(recipe) {
    console.log(recipe);
  }
  _generatedMarkup(recipe) {
    // debugger;
    const servings = recipe.cartServings;
    const previous = servings === CART_SERVINGS ? -1 : +servings - 1;
    const current = servings === CART_SERVINGS ? 'Add' : +servings;
    const next = servings === CART_SERVINGS ? 1 : +servings + 1;
    // console.log(previous, current, next);
    return `
      <div class="preview__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${previous}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <span class="preview__info-data preview__info-data--people">${
                current // servings
              }</span>
              <button class="btn--tiny btn--update-servings" data-update-to="${next}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
      </div>
    `;
  }
}

export default new AddToCartBtnView();
