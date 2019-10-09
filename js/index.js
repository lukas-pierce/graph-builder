import {Calculator} from './calculator.js';
import {Plotter} from './plotter.js';

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const xValuesInput = form.querySelector('input[name=xValues]');
  const canvas = document.getElementById('canvas');
  const calculator = new Calculator();
  const plotter = new Plotter();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    const xValues = xValuesInput.value.trim().toLocaleLowerCase();
    if (!xValues) return xValuesInput.focus();
    const data = xValues.split(/\s*;\s*/).map(x => parseFloat(x));
    const points = data.map(x => {
      const y = calculator.calc(expression, {x});
      return [x, y];
    });

    plotter.render(canvas, points);
  });

})();
