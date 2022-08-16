import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

Notify.init({
  width: '50%',
});

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

function onSearchCountry(e) {
  const inputValue = e.target.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(data => {
        createMarkup(data);
      })
      .catch(error => {
        if (error.message === '404') {
          Notify.failure('Oops, there is no country with that name');
          return;
        }
        Notify.failure('Something wrong...');
      });
  }
}

function createMarkup(data) {
  if (data.length >= 2 && data.length <= 10) {
    createList(data);
    return;
  } else if (data.length === 1) {
    createCard(data);
    return;
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function createList(data) {
  const markup = data
    .map(item => {
      return `
      <li class="country-list__item">
      <img class="country-list__img" src="${item.flags.svg}" alt="${item.name.official}">

      <h2 class="country-list__title">${item.name.official}</h2>
        </li>
      `;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createCard(country) {
  const { flags, name, capital, languages, population } = country[0];
  const markup = `
      <div class="card-body">

        <div class="card-name">
            <img class="card-info__img" src="${flags.svg}" 
            alt="${name.official}">
          <h2 class="card-info__title">${name.official}</h2>
        </div>

          <p class="card-info__capital">Capital: ${capital}</p>
          <p class="card-info__population">Population: ${population}</p>
          <p class="card-info__languages">Languages: ${Object.values(
            languages
          )}</p>
      </div>
      `;
  refs.countryInfo.innerHTML = markup;
}
