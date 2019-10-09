import {Tokenizer, TokensCollection} from './tokenizer.js';
import {Calculator} from "./calculator.js";

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const tokensEl = document.getElementById('tokens');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    const tokens = Tokenizer.tokenize(expression);

    const calculator = new Calculator(tokens);
    const resultTokens = calculator.calc();

    // show steps
    tokensEl.innerHTML = '';
    calculator.steps.forEach((step, index) => {
      tokensEl.innerHTML +=
        `<span class="step-index">STEP ${(index + 1)}</span>:\n` +
        `<span class="step-name">${step.name}</span>\n` +
        `<span class="step-tokens">${step.tokens}</span>\n` +
        '\n';
    });

  })

})();
