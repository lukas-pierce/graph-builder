require = require('esm')(module);
const {Calculator, CalculatorError} = require('../js/calculator');
const calculator = new Calculator();

// undefined variable exception
test('throws undefined variable in expression: x + 1', () => {
  function calc() {
    calculator.calc('x + 1');
  }

  expect(calc).toThrowError(CalculatorError);
  expect(calc).toThrowError('undefined variable');
});

// not number variable exception
test('throws variable is not number: x + x, x = \'a\'', () => {
  function calc() {
    calculator.calc('x + x', {x: 'a'});
  }
  expect(calc).toThrowError(CalculatorError);
  expect(calc).toThrowError('variable is not number');
});

// unknown function
test('throws unknown function: some(100)', () => {
  function calc() {
    calculator.calc('some(100)');
  }
  expect(calc).toThrowError(CalculatorError);
  expect(calc).toThrowError('unknown function');
});
