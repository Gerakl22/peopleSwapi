const urlPeople = "https://swapi.dev/api/people";
const urlSearch = "https://swapi.dev/api/people/?search=";

const bodyNode = document.body;

const sectionPeopleNode = document.querySelector(".people");
const wrapperPeopleNode = document.querySelector(".people__wrapper");
const paginationNode = document.querySelector(".people__pagination");

const state = {
  currentPage: 1,
  numberOfArticlesOnPage: 10,
  arrayPeople: [],
};

async function getData() {
  try {
    const responses = await Promise.all(
      createArrayUrlsOfPeople().map((url) => fetch(url))
    );
    const data = await Promise.all(responses.map((res) => res.json()));

    data.forEach((person) => state.arrayPeople.push(...person.results));

    openPageOfPeople(state.arrayPeople);
    paginationPeople(state.arrayPeople);
  } catch (e) {
    throw new Error(e.message);
  }
}

async function getSearch(name) {
  try {
    const response = await fetch(`${urlSearch}${name}`);
    const data = await response.json();

    state.arrayPeople = data.results.slice();

    searchPeople(state.arrayPeople);
  } catch (e) {
    throw new Error(e.message);
  }
}

function createArrayUrlsOfPeople() {
  let people = [];
  for (let i = 1; i <= 9; i++) {
    people.push(`${urlPeople}/?page=${i}`);
  }

  return people;
}

function createId(id) {
  return id.split("").slice(-7, -1).join("");
}

function displayPeople(arrayPeople) {
  let output = "";

  arrayPeople.map((person) => {
    output += `<div class="people__content" id=${createId(person.created)}>
                    <h3 class="people__name" id=${createId(person.created)}>${
      person.name
    }</h3>
                    <div class="people__description" id=${createId(
                      person.created
                    )}>
                      <p class="people__gender"> <span class="people__subtitle">Gender:</span> ${
                        person.gender
                      }</p>
                      <p class="people__birth-year"> <span class="people__subtitle">Birthday:</span> ${
                        person.birth_year
                      }</p>
                      <p class="people__height"> <span class="people__subtitle">Height:</span> ${
                        person.height
                      }</p>
                      <p class="people__mass"> <span class="people__subtitle">Mass:</span> ${
                        person.mass
                      }</p>
                      <p class="people__eye-color"> <span class="people__subtitle">Eye color:</span> ${
                        person.eye_color
                      }</p>
                      <p class="people__hair-color"> <span class="people__subtitle">Hair color:</span> ${
                        person.hair_color
                      }</p>
                      <p class="people__skin-color"> <span class="people__subtitle">Skin color:</span> ${
                        person.skin_color
                      }</p>
                      <button class="people__button people__button--absolute" id=${createId(
                        person.created
                      )}>X</button>
                    </div>
                </div>`;

    wrapperPeopleNode.innerHTML = output;
  });
}

function filterPerson(e) {
  let text = e.target.value.toLowerCase().trim();
  let people = e.currentTarget.getElementsByTagName("h3");

  getSearch(text);

  Array.from(people).forEach((person) => {
    let personName = person.textContent;
    if (personName.toLowerCase().trim().indexOf(text) != -1) {
      person.parentNode.style.display = "block";
    } else {
      person.parentNode.style.display = "none";
    }
  });
}

function openPageOfPeople(arrayPeople) {
  state.currentPage--;

  let start = state.numberOfArticlesOnPage * state.currentPage;

  let end = start + state.numberOfArticlesOnPage;

  let paginatedArray = arrayPeople.slice(start, end);

  displayPeople(paginatedArray);
}

function paginationButton(page, arrayPeople) {
  let btnNode = document.createElement("button");
  btnNode.classList.add("people__button");
  btnNode.textContent = page;

  if (state.currentPage === page - 1) {
    btnNode.classList.add("people__button--active");
  }

  btnNode.addEventListener("click", function () {
    state.currentPage = page;

    openPageOfPeople(arrayPeople);

    let currentBtnNode = document.querySelector(".people__button--active");
    currentBtnNode.classList.remove("people__button--active");

    btnNode.classList.add("people__button--active");
  });

  return btnNode;
}

function paginationPeople(arrayPeople) {
  paginationNode.innerHTML = "";

  let pageCount = Math.ceil(arrayPeople.length / state.numberOfArticlesOnPage);

  for (let page = 1; page <= pageCount; page++) {
    let btnNode = paginationButton(page, arrayPeople);
    paginationNode.appendChild(btnNode);
  }
}

function searchPeople(arrayPeople) {
  displayPeople(arrayPeople);
}

function toggleContentPeople(e) {
  if (e.target.classList.contains("people__name")) {
    let peopleContentNode = e.target.parentNode;
    let peopleDescriptionNode = peopleContentNode.querySelector(
      ".people__description"
    );
    let btnCloseDescriptionNode = peopleContentNode.querySelector(
      ".people__button--absolute"
    );

    if (e.target) {
      if (peopleContentNode.dataset.id === peopleDescriptionNode.dataset.id) {
        peopleDescriptionNode.style.display = "flex";
      }

      btnCloseDescriptionNode.addEventListener("click", () => {
        peopleDescriptionNode.style.display = "none";
      });
    }
  }
}

getData();

bodyNode.addEventListener("input", filterPerson);
wrapperPeopleNode.addEventListener("click", toggleContentPeople);
