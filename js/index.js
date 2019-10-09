import {Calculator} from './calculator.js';
import {Plotter} from './plotter.js';

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const canvas = document.getElementById('canvas');
  const calculator = new Calculator();
  const plotter = new Plotter();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    const x = [-3, -2, -1, 0, 1, 2, 3];
    const points = x.map(x => {
      const y = calculator.calc(expression, {x});
      return [x, y];
    });

    plotter.render(canvas, points);
  });

})();
