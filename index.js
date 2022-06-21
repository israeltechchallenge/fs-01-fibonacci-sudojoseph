//Element selectors
const outputElm = document.getElementById('output');
const formElm = document.getElementsByTagName('form')[0];
const inputElm = document.getElementsByTagName('input')[0];

//Counter values for fibonacciCalculator
let prevNr = 0, newNr = 0, outputNr = 0;

//Fibonacci Calculator function
const fibonacciCalculator = index => {
    if (index == 0) {
        outputElm.innerText = outputNr;
        prevNr = 0, newNr = 0, outputNr = 0;
        return;
    }

    outputNr = prevNr + newNr;
    prevNr = newNr;
    newNr = outputNr;

    if (prevNr === 0) prevNr = 1, outputNr = 1;
    
    fibonacciCalculator(index-1);
}

//Event listener
formElm.addEventListener('submit', e => {
    e.preventDefault();
    fibonacciCalculator(inputElm.value);
});