import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class AddToCartView extends View {
  _parentElement = document.querySelector('.add__to__cart__list');
  _errorMessage = 'No Food being Added. Please Add Some Food:)';
  addAddToCartHandler(handler) {
    this._parentElement.addEventListener('click', e => {
      console.log(`Hello`);

      handler(this._parentElement);
    });
  }
  _generatedMarkup(recipes) {
    return recipes
      .map(addToCart => previewView.render(addToCart, false))
      .join('');
  }
}

export default new AddToCartView();
