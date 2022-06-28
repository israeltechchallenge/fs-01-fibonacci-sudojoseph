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
  if (number < 50 && number >= 0) {
    if (saveCalculationsCheckbox.checked) {
      try {
        toggleSpinner(specificNrSpinner);
        const response = await apiHandeling(URL)
        printSingleFibonacci(response);
      } catch (err) {
        printServerError(err);
        toggleSpinner(specificNrSpinner)
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
  toggleSpinner(specificNrSpinner);
  showAllCalculations();
};

//Print error message

const printServerError = (errMsg) => {
  serverError.innerText = errMsg;
};

//Get all past fibonacci calculations from server

const showAllCalculations = async () => {
  const URL = 'http://localhost:5050/getFibonacciResults'
  toggleSpinner(spinnerAllCalculations);
  try {

    const response = await apiHandeling(URL);
    printListOfAllCalculations(response);
  } catch (err) {
    printServerError(err);
    toggleSpinner(spinnerAllCalculations);
  }
};

const printListOfAllCalculations = (data) => {
  let elmList = "";

  data.results.map(
    (calcObj) =>
      (elmList += `<li class="border-bottom border-dark pb-3 pt-3">The Fibonacci of <b>${
        calcObj.number
      }</b> is <b>${calcObj.result}</b>. Calculated at: ${new Date(
        calcObj.createdDate
      )}</li>`)
  );
  
  allCalculationsList.innerHTML = elmList;
  toggleSpinner(spinnerAllCalculations);
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
const toggleSpinner = (spinner) => {
  if (!spinner.classList.contains("d-none")) {
    spinner.classList.add("d-none");
  } else {
    spinner.classList.remove("d-none");
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

//Event listener
formElm.addEventListener("submit", (e) => {
  e.preventDefault();
  showSpecificFibonacciNr(inputElm.value);
});

//On page load
showAllCalculations();
