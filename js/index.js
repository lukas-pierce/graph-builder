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
    const calculator = new Calculator();
    const resultTokens = calculator.calc(tokens);
    tokensEl.innerHTML = (new TokensCollection(resultTokens)).toString();

  })

})();
