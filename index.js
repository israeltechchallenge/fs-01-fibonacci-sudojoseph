//Element selectors
const formElm = document.getElementsByTagName("form")[0];
const inputElm = document.getElementsByTagName("input")[0];
const outputElm = document.getElementById("output");
const specificNrSpinner = document.getElementById("spinnerSpecificNr");
const spinnerAllCalculations = document.getElementById("spinnerAllCalculations");
const serverError = document.getElementById("serverError");
const lessThanFiftyErr = document.getElementById("lessThanFiftyErr");
const allCalculationsList = document.getElementById("allCalculationsList");
const saveCalculationsCheckbox = document.getElementById("saveCalculations");
const allDropdownItems = document.querySelectorAll('.dropdown-item');

//Global variables
let allSearchesList = [];
let sortPreference;

//Api fetch function

const apiHandeling = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
       throw new Error(errorText);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

//Get single fibonacci number from server

const showSpecificFibonacciNr = async (number) => {
  if (!number) return;
  const URL = `http://localhost:5050/fibonacci/${number}`;

  //Initialize elements
  showValidateMsg(false);
  serverError.innerText = "";
  outputElm.innerText = "";

  //Fronted validation check
  if (number <= 50 && number >= 0) {
    if (saveCalculationsCheckbox.checked) {
      try {
        showHideSpinner(specificNrSpinner, 1);
        const response = await apiHandeling(URL)
        showHideSpinner(specificNrSpinner, 0);
        printSingleFibonacci(response);
      } catch (err) {
        printServerError(err);
        showHideSpinner(specificNrSpinner, 0);
      }
    } else {
      fibonacciLocalCalculation(number);
    }
  } else {
    showValidateMsg(true, number);
  }
};

//Wright specific number to page
const printSingleFibonacci = (data) => {
  outputElm.innerText = data.result;
  showAllCalculations();
};

const sortList = (innerText) => {
  switch (innerText) {
    case 'Number Asc':
      allSearchesList.sort((a, b) => a.number - b.number);
      break;
    case 'Number Desc':
      allSearchesList.sort((a, b) => b.number - a.number);
      break;
    case 'Date Asc':
      allSearchesList.sort((a, b) => a.createdDate - b.createdDate);
      break;
    case 'Date Desc':
      allSearchesList.sort((a, b) => b.createdDate - a.createdDate);
  }
  
  printListOfAllCalculations(allSearchesList);
};

//Get all past fibonacci calculations from server

const showAllCalculations = async () => {
  const URL = 'http://localhost:5050/getFibonacciResults';
  try {
    showHideSpinner(spinnerAllCalculations, 1);
    const response = await apiHandeling(URL);
    allSearchesList = response.results;
    showHideSpinner(spinnerAllCalculations, 0);
    !sortPreference ? printListOfAllCalculations(allSearchesList) : sortList(sortPreference);
  } catch (err) {
    printServerError(err);
    showHideSpinner(spinnerAllCalculations, 0);
  }
};

const printListOfAllCalculations = (data) => {
  let elmList = "";

  data.map(calcObj => elmList += `<li class="border-bottom border-dark pb-3 pt-3">
      The Fibonacci of <b>${calcObj.number}</b> is <b>${calcObj.result}</b>. 
      Calculated at: ${new Date(calcObj.createdDate)}
    </li>`);
  
  allCalculationsList.innerHTML = elmList;
};

//Print error message

const printServerError = (errMsg) => {
  serverError.innerText = errMsg;
};

//Fibonacci Local Calculation functionality

//Counter values for local fibonacci calculation function
let prevNr = 0, newNr = 0, outputNr = 0;

//Fibonacci Local Calculation function
const fibonacciLocalCalculation = (index) => {
  if (index == 0) {
    outputElm.innerText = outputNr;
    (prevNr = 0), (newNr = 0), (outputNr = 0);
    return;
  }

  outputNr = prevNr + newNr;
  prevNr = newNr;
  newNr = outputNr;

  if (prevNr === 0) (prevNr = 1), (outputNr = 1);

  fibonacciLocalCalculation(index - 1);
};

//Spinner function
const showHideSpinner = (spinnerElm, show) => {
  if (show) {
    spinnerElm.classList.remove("d-none");
  } else {
    spinnerElm.classList.add("d-none");

  }
};

//Validation message for FE validation
const showValidateMsg = (show, num) => {
  const message = num < 0 ? "Can’t be negative" : "Can’t be larger than 50";
  if (show) {
    lessThanFiftyErr.innerText = message;
    lessThanFiftyErr.classList.remove("d-none");
    inputElm.classList.add("border-danger", "text-danger");
  } else {
    lessThanFiftyErr.classList.add("d-none");
    inputElm.classList.remove("border-danger", "text-danger");
  }
};

//Event listeners
formElm.addEventListener("submit", (e) => {
  e.preventDefault();
  showSpecificFibonacciNr(inputElm.value);
});

allDropdownItems.forEach((item) => {
  item.addEventListener('click', e => {
    sortPreference = e.target.innerText
    sortList(sortPreference);
  });
});

//On page load
showAllCalculations();