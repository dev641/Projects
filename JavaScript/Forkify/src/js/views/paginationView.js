import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addClickHandler(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      // console.log(btn);
      handler(goToPage);
    });
  }
  _generatedMarkup(search) {
    const currPage = search.pageNum;
    const numPage = Math.ceil(search.results.length / search.resultsPerPage);

    const nextPage = `
          <button data-goto="${
            currPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;

    const prevPage = `
          <button data-goto="${
            currPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
    `;
    // console.log(numPage);
    // pagenum = 1 and there is other page also
    if (currPage === 1 && numPage > 1) {
      return `
         ${nextPage}
      `;
    }

    if (currPage > 1 && currPage < numPage) {
      return `
          ${prevPage}
          ${nextPage}
      `;
    }
    // last page
    if (currPage === numPage && numPage > 1) {
      return `
          ${prevPage}
      `;
    }
    // pagenum =1 and there is no other page
    return ``;
  }
}

export default new PaginationView();
