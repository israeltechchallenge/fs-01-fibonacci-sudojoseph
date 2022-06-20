const indexNr = 6;
const outputElm = document.getElementById('output');

const fibonacciCalculator = index => {
    let prevNr = 0, newNr = 0, outputNr = 0;

    for (let i = 0; i < index; i++) {
        if (i < 1) {
            prevNr = 1;
        }

        outputNr = prevNr + newNr;
        prevNr = newNr;
        newNr = outputNr;
    }

    outputElm.innerText = `The Fibonacci of ${index} is ${outputNr}`;
}

fibonacciCalculator(indexNr);