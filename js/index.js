import {Calculator, CalculatorError} from './calculator.js';
import {Plotter} from './plotter.js';

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const variableNameInput = form.querySelector('input[name=variableName]');
  const valuesInput = form.querySelector('input[name=values]');
  const resultEl = document.getElementById('result');
  const canvas = document.getElementById('canvas');
  const calculator = new Calculator();
  const plotter = new Plotter();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    const variableRange = valuesInput.value.trim().toLocaleLowerCase();
    if (!variableRange) return valuesInput.focus();

    const variableName = variableNameInput.value.trim().toLocaleLowerCase();
    if (!variableName) return variableNameInput.focus();

    try {
      const data = variableRange.split(/\s*;\s*/).map(x => parseFloat(x));
      const points = data.map(value => {
        const variables = {[variableName]: value};
        const y = calculator.calc(expression, variables);
        return [value, y];
      });

      resultEl.innerHTML = points.reduce((str, point) => {
        str += `(${point[0]}, ${point[1]})\n`;
        return str;
      }, '');

      plotter.render(canvas, points);
    } catch (e) {
      if (e instanceof CalculatorError) {
        resultEl.innerHTML = '<span class="error">' + e.message + '</span>'
      } else throw e
    }

  });

})();
