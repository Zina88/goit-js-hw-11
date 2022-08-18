import { fetchPicture } from './js/fetchAPI';
import { renderMarkup } from './js/render-markup';
import { Notify } from 'notiflix';

Notify.init({
  width: '50%',
});

let searchQuery = '';
let page = 1;
const perPage = 40;

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMore.addEventListener('click', onLoadMore);

function onSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  resetPage();
  console.log(searchQuery);

  if (searchQuery !== '') {
    fetchPicture(searchQuery, page, perPage)
      .then(({ data }) => {
        if (data.totalHits === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        renderMarkup(data.hits);
      })
      .catch(error => console.log(error))
      .finally(() => {
        refs.searchForm.reset();
      });
  }
}

function onLoadMore() {
  increment();
  fetchPicture(searchQuery, page, perPage).then(({ data }) => {
    renderMarkup(data.hits);

    if (page * 40 > data.totalHits) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function increment() {
  page += 1;
}

function resetPage() {
  page = 1;
}
