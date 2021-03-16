const urlPeople = "https://swapi.dev/api/people/";
const urlPeoplePage = "https://swapi.dev/api/people/?page=";
const urlSearch = "https://swapi.dev/api/people/?search=";

const bodyNode = document.body;

const wrapperPeopleNode = document.querySelector(".people__wrapper");
const paginationNode = document.querySelector(".people__pagination");

const state = {
  currentPage: 1,
  numberOfArticlesOnPage: 10,
  text: null,
  isSearch: false,
};

async function getData(url, id) {
  try {
    if (url === urlSearch) {
      state.isSearch = true;
      state.currentPage = 1;
    }

    const response = await fetch(`${url}${id}`);
    const data = await response.json();

    displayPeople(data.results);
    paginatePeople(data.results, data.count);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getNextSearch(url, text, id) {
  try {
    const response = await fetch(`${url}${text}&page=${id}`);
    const data = await response.json();

    displayPeople(data.results);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getDescriptionPerson(url) {
  try {
    const response = await fetch(url);
    const person = await response.json();

    displayDescriptionPerson(person);
  } catch (error) {
    throw new Error(error.message);
  }
}

function displayPeople(arrayPeople) {
  let output = "";
  arrayPeople.map((person) => {
    output += `<div class="people__content">
                    <h3 class="people__name" id=${person.url}>${person.name}</h3>
                </div>`;

    wrapperPeopleNode.innerHTML = output;
  });
}

function displayDescriptionPerson(person) {
  let personDescription = `<div class="people__content">
                          <h3 class="people__name">${person.name}</h3>
                          <div class="people__description">
                              <p class="people__gender"> <span class="people__subtitle">Gender:</span> ${person.gender}</p>
                              <p class="people__birth-year"> <span class="people__subtitle">Birthday:</span> ${person.birth_year}</p>
                              <p class="people__height"> <span class="people__subtitle">Height:</span> ${person.height}</p>
                              <p class="people__mass"> <span class="people__subtitle">Mass:</span> ${person.mass}</p>
                              <p class="people__eye-color"> <span class="people__subtitle">Eye color:</span> ${person.eye_color}</p>
                              <p class="people__hair-color"> <span class="people__subtitle">Hair color:</span> ${person.hair_color}</p>
                              <p class="people__skin-color"> <span class="people__subtitle">Skin color:</span> ${person.skin_color}</p>
                              <button class="people__button people__button--absolute">X</button>
                          </div>
                        </div> `;

  wrapperPeopleNode.innerHTML = personDescription;

  let btnCloseDescriptionNode = wrapperPeopleNode.querySelector(
    ".people__button--absolute"
  );

  btnCloseDescriptionNode.addEventListener("click", updateStateSearch);
}

function filterPerson(e) {
  let text = e.target.value.toLowerCase().trim();
  let people = e.currentTarget.getElementsByTagName("h3");

  state.text = text;

  getData(urlSearch, state.text);

  Array.from(people).forEach((person) => {
    let personName = person.textContent;
    if (personName.toLowerCase().trim().indexOf(text) != -1) {
      person.parentNode.style.display = "block";
    } else {
      person.parentNode.style.display = "none";
    }
  });
}

function paginateButton(page) {
  let btnNode = document.createElement("button");
  btnNode.classList.add("people__button");
  btnNode.textContent = page;

  if (state.currentPage === page) {
    btnNode.classList.add("people__button--active");
  }

  btnNode.addEventListener("click", () => {
    state.currentPage = page;

    updateStateSearch();

    let currentBtnNode = document.querySelector(".people__button--active");
    currentBtnNode.classList.remove("people__button--active");

    btnNode.classList.add("people__button--active");
  });

  return btnNode;
}

function paginatePeople(arrayPeople, numberOfPeople) {
  paginationNode.innerHTML = "";

  let pageCount = Math.ceil(numberOfPeople / state.numberOfArticlesOnPage);

  for (let page = 1; page <= pageCount; page++) {
    let btnNode = paginateButton(page, arrayPeople);
    paginationNode.appendChild(btnNode);
  }
}

function updateStateSearch() {
  if (state.isSearch === true) {
    getNextSearch(urlSearch, state.text, state.currentPage);
  } else {
    state.isSearch = false;
    getData(urlPeoplePage, state.currentPage);
  }
}

getData(urlPeoplePage, state.currentPage);

bodyNode.addEventListener("input", filterPerson);
wrapperPeopleNode.addEventListener("click", (e) => {
  if (e.target.classList.contains("people__name")) {
    getDescriptionPerson(e.target.id);
  }
});
