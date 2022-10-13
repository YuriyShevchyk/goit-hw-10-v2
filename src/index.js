import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchсountries';

const inputEL = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;



const onSearchCountry = evt => {
  clearMarkup();
  const countryName = evt.target.value.trim().toLowerCase();

  if (countryName === '') {
    clearMarkup();
    return;
  }
  fetchCountries(countryName)
    .then(countries => {
      insertMarkup(countries);
    })
    .catch(error => {
      if (error === 'Error 404') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
};

const makeMinMarkup = item => `<li> 
    <img src="${item.flags.svg}" width="50">
    <h2>${item.name.official}</h2>
  </li>`;

const makeMaxMarkup = item => `<li>
    <img src="${item.flags.svg}" width=70px>
    <p> ${item.name.official}</p>
    <p>Capital: ${item.capital}</p>
    <p>Population: ${item.population}</p>
    <p>Languages: ${Object.values(item.languages)}</p>
  </li>`;

  function generateMarkup(array) {
    if (array.length > 10) {
      Notify.warning(
        "Too many matches found. Please enter a more specific name.")
      listEl = '';
      
    } 

    else if(array.length > 1 && array.length <= 10){            
        return array.reduce((acc, item) => acc + makeMinMarkup(item), '')}

     else if(array.length === 1) {
        return array.reduce((acc, item) => acc + makeMaxMarkup(item), '') 
    } 
}

function insertMarkup(array) {
    const result = generateMarkup(array);
    listEl.insertAdjacentHTML('beforeend', result);
}

function clearMarkup(){
    listEl.innerHTML = "";
    countryInfoEl.innerHTML = "";
}

inputEL.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));


// commit?
