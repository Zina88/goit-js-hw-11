const BASE_URL = 'https://restcountries.com/v3.1/name/';
const FILTER = '?fields=name,capital,flags,languages,population';

export default function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}${FILTER}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
