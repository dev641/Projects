import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  renderSpineer() {
    const markup = `
      <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> 
  `;
    this._addMarkup(markup);
  }
  render(data, render = true) {
    // console.log(data);
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generatedMarkup(this._data);
    if (!render) return markup;
    this._addMarkup(markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generatedMarkup(this._data);

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // debugger;
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    console.log(this._parentElement);

    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      // console.log(, newEl);

      if (!newEl.isEqualNode(curEl)) {
        // Update Attributes
        Array.from(newEl.attributes).forEach(attr => {
          // console.log(attr.name, attr.value);
          curEl.setAttribute(attr.name, attr.value);
        });

        //update textContent
        if (newEl.firstChild?.nodeValue.trim() !== '')
          curEl.textContent = newEl.textContent;
      }
    });
  }
  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._addMarkup(markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._addMarkup(markup);
  }
  servingsUpdator(e) {
    const btn = e.target.closest('.btn--update-servings');
    if (!btn) return;
    // console.log(btn);
    const el = e.target.closest('.preview__link');
    const { updateTo } = btn.dataset;

    return { el, updateTo };
  }
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      // debugger;
      const { updateTo } = this.servingsUpdator(e);
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerUpdateServingsAddToCart(handler) {
    this._parentElement.addEventListener('click', e => {
      const obj = this.servingsUpdator(e);
      // console.log(obj);

      const { el, updateTo } = obj;
      if (+updateTo >= 0) handler(el, +updateTo);
      // else handler(el, '0');
    });
  }
  _addMarkup(markup) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
