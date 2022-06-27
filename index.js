//Element selectors
const formElm = document.getElementsByTagName('form')[0];
const inputElm = document.getElementsByTagName('input')[0];
const outputElm = document.getElementById('output');
const specificNrSpinner = document.getElementById('spinnerSpecificNr');
const spinnerAllCalculations = document.getElementById('spinnerAllCalculations');
const serverError = document.getElementById('serverError');
const lessThanFiftyErr = document.getElementById('lessThanFiftyErr');
const allCalculationsList = document.getElementById('allCalculationsList');
const saveCalculationsCheckbox = document.getElementById('saveCalculations');


//Fibonacci Calculator 
const showSpecificFibonacciNr = number => {
    if (!number) return;
    const URL = `http://localhost:5050/fibonacci/${number}`;
    
    //Initialize elements
    showValidateMsg(false);
    serverError.innerText = '';
    outputElm.innerText = '';

    //Callback functions for success and error
    const onSuccess = data => {
        outputElm.innerText = data.result;
        toggleSpinner(specificNrSpinner);
        showAllCalculations();
    };

    const onError = errMsg => {
        serverError.innerText = errMsg;
        toggleSpinner(specificNrSpinner);
    };



    //Fronted validation check
    if (number < 50 && number >= 0) {
        if (saveCalculationsCheckbox.checked) {
            toggleSpinner(specificNrSpinner);
            apiHandeling(URL, onSuccess, onError);
        } else {
            fibonacciLocalCalculation(number);
        }
    } else {
        showValidateMsg(true, number);
    }
}

const showAllCalculations = () => {
    const URL = 'http://localhost:5050/getFibonacciResults';

    toggleSpinner(spinnerAllCalculations);

    const onSuccess = data => {
        let elmList = '';

        data.results.map(calcObj => elmList += `<li class="border-bottom border-dark pb-3 pt-3">The Fibonacci of <b>${calcObj.number}</b> is <b>${calcObj.result}</b>. Calculated at: ${new Date(calcObj.createdDate)}</li>`);

        allCalculationsList.innerHTML = elmList;
        toggleSpinner(spinnerAllCalculations);

    };

    const onError = () => {
        toggleSpinner(spinnerAllCalculations);
    };

    apiHandeling(URL, onSuccess);
}

//Counter values for local fibonacci calculation function
let prevNr = 0, newNr = 0, outputNr = 0;

//Fibonacci Local Calculation function
const fibonacciLocalCalculation = index => {
    if (index == 0) {
        outputElm.innerText = outputNr;
        prevNr = 0, newNr = 0, outputNr = 0;
        return;
    }

    outputNr = prevNr + newNr;
    prevNr = newNr;
    newNr = outputNr;

    if (prevNr === 0) prevNr = 1, outputNr = 1;
    
    fibonacciLocalCalculation(index-1);
}

//Api fetch function

const apiHandeling = async (url, onSuccess, onError) => { 
    const response = await fetch(url);

    if(!response.ok) {
        const errorText = await response.text()
        onError(errorText);
        throw new Error(`¯¯\\_(ツ)_//¯¯ Noooo you got an error with the following status: ${response.status}`);
    }

    const data = await response.json();
    onSuccess(data);
}

const toggleSpinner = spinner => {
    if (!spinner.classList.contains('d-none')) {
        spinner.classList.add('d-none');
    } else {
        spinner.classList.remove('d-none');
    }
} 

const showValidateMsg = (show, num) => {
    const message = num < 0 ? 'Can’t be negative' : 'Can’t be larger than 50';
    if (show) {
        lessThanFiftyErr.innerText = message;
        lessThanFiftyErr.classList.remove('d-none');
        inputElm.classList.add('border-danger', 'text-danger');
    } else {
        lessThanFiftyErr.classList.add('d-none');
        inputElm.classList.remove('border-danger', 'text-danger');
    }
} 

//Event listener
formElm.addEventListener('submit', e => {
    e.preventDefault();
    showSpecificFibonacciNr(inputElm.value);
}); 

showAllCalculations();