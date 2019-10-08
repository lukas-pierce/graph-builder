import {Tokenizer} from './tokenizer.js';

(function () {

  const form = document.getElementById('math-form');
  const expressionInput = form.querySelector('input[name=expression]');
  const tokensEl = document.getElementById('tokens');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const expression = expressionInput.value.trim().toLocaleLowerCase();
    if (!expression) return expressionInput.focus();

    const tokens = Tokenizer.tokenize(expression);

    // show tokens
    const tokensDebug = tokens.reduce(function (arr, token, index) {
      const line = index + " => " + token.type + "(" + token.value + ")";
      arr.push(line);
      return arr;
    }, []);
    tokensEl.innerHTML = 'tokens:\n' + tokensDebug.join('\n');
  })

})();
