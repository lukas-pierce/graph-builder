require = require("esm")(module /*, options*/);
const {Calculator} = require('../js/calculator');

const calculator = new Calculator();

const BREAK = 'BREAK';

let cases = [
  /*
   * You can insert BREAK between cases:
   *
   * {expression: '1+1', should: 2},
   * BREAK
   * {expression: '1+2', should: 3},
   * {expression: '1+3', should: 4},
   * ...
   */

  // add
  {expression: '1 + 2', should: 3},
  {expression: '1 + -2', should: -1},
  {expression: '1 + --2', should: 3},

  // sub
  {expression: '1 - 2', should: -1},
  {expression: '1 -- 2', should: 3},
  {expression: '1 --- 2', should: -1},
  {expression: '10 - 5 - 2', should: 3},
  {expression: '10 - 3.5 - 1', should: 5.5},

  // mul
  {expression: '2 * 2', should: 4},
  {expression: '2 * -2', should: -4},
  {expression: '2 * 2 * 3', should: 12},

  // div
  {expression: '2 / 2', should: 1},
  {expression: '8 / 2 / 2', should: 2},
  {expression: '1 / 0', should: Infinity},

  // pow
  {expression: '123^0', should: 1},
  {expression: '2^2', should: 4},
  {expression: '2^3', should: 8},
  {expression: '2^2^2', should: 16},
  {expression: '2^(2^2)', should: 16},
  {expression: '2^2^3', should: 64},
  {expression: '2^(2^3)', should: 256},
  {expression: '1.5^2', should: 2.25},
  {expression: '2^1.5', should: 2.8284271247461903},
  {expression: 'round(2^1.5)', should: 3},

  // custom functions
  {expression: 'sqrt(4)', should: 2},
  {expression: 'sqrt(9)', should: 3},
  {expression: 'plus(1,2)', should: 3},
  {expression: 'sum(1,2,3)', should: 6},

  // variables
  {expression: 'x', should: 21, variables: {x: 21}},
  {expression: '2 * x', should: 10, variables: {x: 5}},
  {expression: '2 * x + a', should: 13, variables: {x: 5, a: 3}},

  // parenthesis
  {expression: '(2)', should: 2},
  {expression: '(2 - 1) * 3', should: 3},
  {expression: '2 - 1 * 3', should: -1},
  {expression: '2 / 2 / 2', should: 0.5},
  {expression: '2 / (2 / 2)', should: 2},
  {expression: '2 / (2 / (2 - 1))', should: 1},
];


// take cases before BREAK
const breakInx = cases.findIndex(c => c === BREAK);
if (~breakInx) {
  cases = cases.slice(0, breakInx)
}

cases.forEach(_case => {
  test(`${_case.expression} = ${_case.should}`, () => {
    const result = calculator.calc(_case.expression, _case.variables || {});
    expect(result).toBe(_case.should);
  });
});
