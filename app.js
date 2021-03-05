const urlPeople = "https://swapi.dev/api/people";

const bodyNode = document.body;

const sectionPeopleNode = document.querySelector(".people");
const wrapperPeopleNode = document.querySelector(".people__wrapper");
const paginationNode = document.querySelector(".people__pagination");

let currentPage = 1;
const numberOfArticlesOnPage = 10;
let arrayPeople = [];

async function getData() {
  try {
    const responses = await Promise.all(
      createArrayUrlsOfPeople().map((url) => fetch(url))
    );
    const data = await Promise.all(responses.map((res) => res.json()));

    data.forEach((person) => arrayPeople.push(...person.results));

    displayPeoplePage(arrayPeople, numberOfArticlesOnPage);
    paginationPeople(arrayPeople, numberOfArticlesOnPage);
  } catch (e) {
    throw new Error(e.message);
  }
}

function createArrayUrlsOfPeople() {
  let people = [];
  for (let i = 1; i < 10; i++) {
    people.push(`${urlPeople}/?page=${i}`);
  }

  return people;
}

function createId() {
  return new Date().getTime();
}

getData();

function displayPeoplePage(arrayPeople, numberOfArticlesOnPage) {
  let output = "";
  currentPage--;
  console.log(currentPage);

  let start = numberOfArticlesOnPage * currentPage;

  let end = start + numberOfArticlesOnPage;
  let paginatedArray = arrayPeople.slice(start, end);

  paginatedArray.map((person) => {
    output += `<div class="people__content">
                    <h3 class="people__name">${person.name}</h3>
                    <div class="people__description">
                      <p class="people__gender"> <span class="people__subtitle">Gender:</span> ${person.gender}</p>
                      <p class="people__birth-year"> <span class="people__subtitle">Birthday:</span> ${person.birth_year}</p>
                      <p class="people__height"> <span class="people__subtitle">Height:</span> ${person.height}</p>
                      <p class="people__mass"> <span class="people__subtitle">Mass:</span> ${person.mass}</p>
                      <p class="people__eye-color"> <span class="people__subtitle">Eye color:</span> ${person.eye_color}</p>
                      <p class="people__hair-color"> <span class="people__subtitle">Hair color:</span> ${person.hair_color}</p>
                      <p class="people__skin-color"> <span class="people__subtitle">Skin color:</span> ${person.skin_color}</p>
                    </div>
                </div>`;

    wrapperPeopleNode.innerHTML = output;
  });
}

function filterPerson(e) {
  let text = e.target.value.toLowerCase().trim();
  let people = e.currentTarget.getElementsByTagName("h3");

  Array.from(people).forEach((person) => {
    let personName = person.textContent;
    if (personName.toLowerCase().trim().indexOf(text) != -1) {
      person.parentNode.style.display = "block";
    } else {
      person.parentNode.style.display = "none";
    }
  });
}

function paginationPeople(arrayPeople, numberOfArticlesOnPage) {
  paginationNode.innerHTML = "";

  let pageCount = Math.ceil(arrayPeople.length / numberOfArticlesOnPage);
  for (let i = 1; i < pageCount + 1; i++) {
    let btnNode = paginationButton(i, arrayPeople, numberOfArticlesOnPage);
    paginationNode.appendChild(btnNode);
  }
}

function paginationButton(page, arrayPeople, numberOfArticlesOnPage) {
  let btnNode = document.createElement("button");
  btnNode.classList.add("people__button");
  btnNode.textContent = page;

  if (currentPage == page) btnNode.classList.add("people__button--active");

  btnNode.addEventListener("click", function () {
    currentPage = page;
    displayPeoplePage(arrayPeople, numberOfArticlesOnPage);

    let currentBtnNode = document.querySelector(".people__button--active");
    console.log(currentBtnNode);
    currentBtnNode.classList.remove("people__button--active");

    currentBtnNode.classList.add("people__button--active");
  });

  return btnNode;
}

// function paginationPeople(numberOfPeoplePages, currentPage) {
//   const numberOfButtons = 3;

//   if (currentPage > numberOfPeoplePages || currentPage < 1) {
//     return {
//       pagination: [],
//       currentPage,
//     };
//   }

//   const buttons = Array(numberOfPeoplePages)
//     .fill(1)
//     .map((e, i) => e + i);

//   const sideOfButtons =
//     numberOfButtons % 2 === 0 ? numberOfButtons / 2 : (numberOfButtons - 1) / 2;

//   function calculateLeft(rest = 0) {
//     return {
//       array: buttons
//         .slice(0, currentPage - 1)
//         .reverse()
//         .slice(0, sideOfButtons + rest)
//         .reverse(),
//       rest: function () {
//         return sideOfButtons - this.array.length;
//       },
//     };
//   }

//   function calculateRight(rest = 0) {
//     return {
//       array: buttons.slice(currentPage).slice(0, sideOfButtons + rest),
//       rest: function () {
//         return sideOfButtons - this.array.length;
//       },
//     };
//   }

//   const leftButtons = calculateLeft(calculateRight().rest()).array;
//   const rightButtons = calculateRight(calculateLeft().rest()).array;

//   return {
//     pagination: [...leftButtons, currentPage, ...rightButtons],
//     currentPage,
//   };
// }

bodyNode.addEventListener("keyup", filterPerson);
