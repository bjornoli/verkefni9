/* eslint-disable no-console */
const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  function init(companies) {
    const input = companies.querySelector('input');
    const form = companies.querySelector('form');
    const main = companies.querySelector('.results');
    function search(e) {
      while (main.firstChild) {
        main.removeChild(main.childNodes[0]);
      }
      main.appendChild(document.createTextNode(''));
      e.preventDefault();
      const request = new XMLHttpRequest();
      let companyName = '';
      const load = document.createElement('img');
      load.src = ('loading.gif');
      const wait = document.createElement('p');
      wait.innerHTML = ('Leita að fyrirtækjum...');
      const div = document.createElement('div');
      div.classList.add('loading');
      div.appendChild(load);
      div.appendChild(wait);
      if (input.value === '' || input.value == null) {
        main.innerHTML = ('Lén verður að vera strengur.');
      } else {
        companyName = API_URL + input.value;
        request.open('GET', companyName);
        console.log(companyName);
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            const info = JSON.parse(request.responseText);
            div.remove();
            if (info.results.length < 1) {
              main.innerHTML = ('Ekkert fyrirtæki fannst fyrir leitarstreng.');
            } else {
              const lkh = ['Lén', 'Kennitala', 'Heimilisfang'];
              const nsa = ['name', 'sn', 'address'];
              for (let i = 0; i < info.results.length; i += 1) {
                if (info.results[i].active === 1) {
                  const active = document.createElement('div');
                  const dl = document.createElement('dl');
                  active.classList.add('company');
                  active.classList.add('company--active');
                  for (let y = 0; y < lkh.length; y += 1) {
                    const dt = document.createElement('dt');
                    const dd = document.createElement('dd');
                    dt.innerHTML = lkh[y];
                    dl.appendChild(dt);
                    dd.innerHTML = info.results[i][nsa[y]];
                    dl.appendChild(dd);
                    active.appendChild(dl);
                  }
                  main.appendChild(active);
                } else {
                  const dl = document.createElement('dl');
                  const inactive = document.createElement('div');
                  inactive.classList.add('company');
                  inactive.classList.add('company--inactive');
                  for (let y = 0; y < lkh.length - 1; y += 1) {
                    const dt = document.createElement('dt');
                    const dd = document.createElement('dd');
                    dt.innerHTML = lkh[y];
                    dl.appendChild(dt);
                    dd.innerHTML = info.results[i][nsa[y]];
                    dl.appendChild(dd);
                    inactive.appendChild(dl);
                  }
                  main.appendChild(inactive);
                }
              }
            }
          } else {
            div.remove();
            main.innerHtml = ('Villa við að sækja gögn.');
          }
        };
        request.send();
        main.appendChild(div);
      }
    }
    form.addEventListener('submit', search);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');
  program.init(companies);
});
