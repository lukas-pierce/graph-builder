import {Tokenizer, TokensCollection} from './tokenizer.js';
import {Calculator, CalculatorError} from './calculator.js';

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const resultEl = document.getElementById('result');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    const tokens = Tokenizer.tokenize(expression);
    const calculator = new Calculator();
    try {
      const resultTokens = calculator.calc(tokens, {
        x: 10
      });

      resultEl.innerHTML += 'tokens:\n';
      resultEl.innerHTML += (new TokensCollection(tokens)).toDetailString();
      resultEl.innerHTML += '\n\n';
      resultEl.innerHTML += 'Result:\n';
      resultEl.innerHTML += (new TokensCollection(resultTokens)).toString();

    } catch (e) {
      if (e instanceof CalculatorError) {
        resultEl.innerHTML = `<span class="error">` + e.message + `</span>`
      } else {
        throw e;
      }
    }

  })

})();
