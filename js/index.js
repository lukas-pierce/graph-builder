import {Calculator} from './calculator.js';
import {Plotter} from './plotter.js';

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const variableNameInput = form.querySelector('input[name=variableName]');
  const valuesInput = form.querySelector('input[name=values]');
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

    const data = variableRange.split(/\s*;\s*/).map(x => parseFloat(x));
    const points = data.map(value => {
      const variables = {[variableName]: value};
      const y = calculator.calc(expression, variables);
      return [value, y];
    });

    plotter.render(canvas, points);
  });

})();
