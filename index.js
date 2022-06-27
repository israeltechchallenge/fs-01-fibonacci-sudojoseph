//Element selectors
const formElm = document.getElementsByTagName('form')[0];
const inputElm = document.getElementsByTagName('input')[0];
const outputElm = document.getElementById('output');
const specificNrSpinner = document.getElementById('spinnerSpecificNr');
const spinnerAllCalculations = document.getElementById('spinnerAllCalculations');
const serverError = document.getElementById('serverError');
const lessThanFiftyErr = document.getElementById('lessThanFiftyErr');
const allCalculationsList = document.getElementById('allCalculationsList');


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
    if (number <= 50) {
        toggleSpinner(specificNrSpinner);
        apiHandeling(URL, onSuccess, onError)
    } else {
        showValidateMsg(true);
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

        // console.log(data.results);
    };

    const onError = () => {
        toggleSpinner(spinnerAllCalculations);
    };

    apiHandeling(URL, onSuccess);
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

const showValidateMsg = (show) => {
    if (show) {
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