//Element selectors
const formElm = document.getElementsByTagName('form')[0];
const inputElm = document.getElementsByTagName('input')[0];
const outputElm = document.getElementById('output');

//Fibonacci Calculator function
const fibonacciCalculator = number => {
    fetch(`http://localhost:5050/fibonacci/${number}`)
    .then(response => response.json())
    .then(data => outputElm.innerText = data.result);
}

//Event listener
formElm.addEventListener('submit', e => {
    e.preventDefault();
    fibonacciCalculator(inputElm.value);
});