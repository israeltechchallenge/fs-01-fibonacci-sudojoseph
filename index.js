//Element selectors
const formElm = document.getElementsByTagName('form')[0];
const inputElm = document.getElementsByTagName('input')[0];
const outputElm = document.getElementById('output');
const spinnerElm = document.getElementById('spinner');
const serverError = document.getElementById('serverError');
const lessThanFiftyErr = document.getElementById('lessThanFiftyErr');


//Fibonacci Calculator function
const fibonacciCalculator = number => {
    if (!number) return;
    
    //Initialize elements
    showValidateMsg(false);
    serverError.innerText = '';
    outputElm.innerText = '';

    //Fronted validation check
    if (number <= 50) {
        toggleSpinner();
        apiHandeling(number)
    } else {
        showValidateMsg(true);
    }
}

const apiHandeling = async num => { 
    const response = await fetch(`http://localhost:5050/fibonacci/${num}`);

    if(!response.ok) {
        await response.text().then(errorText => serverError.innerText = errorText);
        toggleSpinner();
        throw new Error(`¯¯\\_(ツ)_//¯¯ Noooo you got an error with the following status: ${response.status}`);
    }

    const data = await response.json();
    outputElm.innerText = data.result;
    toggleSpinner();
}

const toggleSpinner = () => {
    if (!spinnerElm.classList.contains('d-none')) {
        spinnerElm.classList.add('d-none');
    } else {
        spinnerElm.classList.remove('d-none');
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
    fibonacciCalculator(inputElm.value);
}); 