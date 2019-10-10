import {Calculator, CalculatorError} from './calculator.js';
import {WolframAlphaCalculator, WolframError} from './wolframalpha-calculator.js';
import {Plotter} from './plotter.js';
import {range} from './math.js';

(function () {

  const form = document.getElementById('math-form');
  const btnSubmit = form.querySelector('[type=submit]');
  const expressionInput = form.querySelector('input[name=expression]');
  const variableNameInput = form.querySelector('input[name=variableName]');
  const valuesInput = form.querySelector('input[name=values]');
  const resultEl = document.getElementById('result');
  const canvas = document.getElementById('canvas');
  const calculator = new Calculator();
  const plotter = new Plotter();

  function disableSubmitButton(disable) {
    if (disable) {
      btnSubmit.innerHTML = 'Submit <i class="fa fa-refresh fa-spin"></i>';
      btnSubmit.disabled = true;
    } else {
      btnSubmit.innerHTML = 'Submit';
      btnSubmit.disabled = false;
    }
  }

  function renderResult(points) {
    resultEl.innerHTML = points.reduce((str, point) => {
      str += `(${point[0]}, ${point[1]})\n`;
      return str;
    }, '');

    plotter.render(canvas, points);
  }

  function clearResult() {
    plotter.render(canvas, []);
    resultEl.innerHTML = '';
  }

  function renderCalcError(e) {
    resultEl.innerHTML = '<span class="error">' +
      e.constructor.name + ':\n' + // error name
      e.message +
      '</span>'
  }

  const calculators = {
    lukas({expression, variable, range}) {
      try {
        const points = range.map(value => {
          const variables = {[variable]: value};
          const y = calculator.calc(expression, variables);
          return [value, y];
        });
        renderResult(points);
      } catch (e) {
        if (e instanceof CalculatorError) {
          renderCalcError(e);
        } else throw e
      }
    },
    async wolfram({expression, variable, range}) {
      try {
        disableSubmitButton(true);
        const points = await WolframAlphaCalculator.calc({expression, variable, range});
        renderResult(points);
      } catch (e) {
        if (e instanceof WolframError) {
          renderCalcError(e);
        } else throw e
      } finally {
        disableSubmitButton(false);
      }
    }
  };

  function run() {
    clearResult();

    // get calculator type
    const checkedCalculatorType = form.querySelector('input[name=calculator]:checked');
    if (!checkedCalculatorType) {
      return alert('select calculator type');
    }
    const calculatorType = checkedCalculatorType.value;
    if (!Object.keys(calculators).includes(calculatorType)) {
      return alert('unknown calculator type');
    }

    // read math expression
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    // read range
    const variableRange = valuesInput.value.trim().toLocaleLowerCase();
    if (!variableRange) return valuesInput.focus();
    if (!/^[\d;\-+.]+$/.test(variableRange)) {
      alert('invalid range format');
      return valuesInput.focus();
    }
    const range = variableRange.split(/\s*;\s*/).map(x => parseFloat(x));

    // read variable name
    const variable = variableNameInput.value.trim().toLocaleLowerCase();
    if (!variable) {
      alert('input variable name');
      return variableNameInput.focus();
    }

    calculators[calculatorType]({expression, variable, range});
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run();
  });


  // example range
  expressionInput.value = '-sin(x * -2) + x / 2';
  variableNameInput.value = 'x';
  valuesInput.value = range(-6, 6, 0.1).map(x => x.toFixed(2)).join(';');
  run();


})();
