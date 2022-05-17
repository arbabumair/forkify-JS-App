import View from './View';
import icons from 'url:../../img/icons.svg'; //V2
import {Fraction} from 'fractional';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            
            if(!btn) return ;
            const gotoPage = + btn.dataset.goto;
            handler(gotoPage);
        })
    }


    _generateMarkup() {
        const currentPage = this._data.page;
        const numbPages = Math.ceil( this._data.results.length / this._data.resultsPerPage);
        

        //first page 1 and there are more other pages
        if(currentPage === 1 && numbPages > 1) {
            return `
            <button data-goto ="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>page ${ currentPage + 1 } </span>
                <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }

        //last page
        if(currentPage === numbPages && numbPages > 1) {
            return  `
             <button data-goto ="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1} </span>
            </button>
            
             `;
        } 

         //other page
         if(currentPage < numbPages){
             return  `
             <button data-goto ="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            <button data-goto ="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>page ${currentPage + 1} </span>
                <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
             `;
         }

         //first page 1 (no more pages)
         return '';





    };

};

export default new PaginationView();