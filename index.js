//Element selectors
const outputElm = document.getElementById('output');
const formElm = document.getElementsByTagName('form')[0];
const inputElm = document.getElementsByTagName('input')[0];

//Fibonacci Function
const fibonacciCalculator = index => {
    let prevNr = 0, newNr = 0, outputNr = 0;

    for (let i = 0; i <= index; i++) {

        if (i === 1) prevNr = 1, outputNr = 1;

        outputNr = prevNr + newNr;
        prevNr = newNr;
        newNr = outputNr;
    }

    outputElm.innerText = outputNr;
}

//Form event handler
formElm.addEventListener('submit', e => {
    e.preventDefault();
    fibonacciCalculator(inputElm.value);
});