import './array.js';
import {OPERATOR, LITERAL, Token, TokensCollection} from "./tokenizer.js";

const isAddOperator = token => token.type === OPERATOR && token.value === '+';
const isSubOperator = token => token.type === OPERATOR && token.value === '-';
const isMulOperator = token => token.type === OPERATOR && token.value === '*';
const isDivOperator = token => token.type === OPERATOR && token.value === '/';
const isAddOrSubOperator = token => isAddOperator(token) || isSubOperator(token);
const isMulOrDivOperator = token => isMulOperator(token) || isDivOperator(token);

// операции
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;

// Pipe - последовательный вызов функций на результате предыдущией
const _pipe = (f, g) => (...args) => g(f(...args));
const pipe = (...fns) => fns.reduce(_pipe);

export class Calculator {

  constructor(tokens) {
    this.tokens = tokens;
    this.steps = [];
  }

  /**
   * Схлопывает умножение и деление в последовательности токенов без скобок
   * @param tokens
   * @returns {*}
   * @private
   */
  _collapseMulDiv(tokens) {
    const _tokens = [...tokens]; // clone

    while (_tokens.find(isMulOrDivOperator)) {
      const operatorIndex = _tokens.findIndex(isMulOrDivOperator);
      const operator = _tokens[operatorIndex];
      const operand1 = _tokens[operatorIndex - 1];
      const operand2 = _tokens[operatorIndex + 1];

      const operation = isMulOperator(operator) ? mul : div;
      const result = operation(operand1.value, operand2.value);

      // вместо первого операнда вставить результат
      _tokens[operatorIndex - 1] = new Token(LITERAL, result);

      // удалить оператор и второй операнд
      _tokens.splice(operatorIndex, 2);

      this.steps.push(new TokensCollection([..._tokens]));
    }

    return _tokens;
  }

  _collapseAddSub(tokens) {
    const _tokens = [...tokens]; // clone

    while (_tokens.find(isAddOrSubOperator)) {
      const operatorIndex = _tokens.findIndex(isAddOrSubOperator);
      const operator = _tokens[operatorIndex];
      const operand1 = _tokens[operatorIndex - 1];
      const operand2 = _tokens[operatorIndex + 1];

      const operation = isAddOperator(operator) ? add : sub;
      const result = operation(operand1.value, operand2.value);

      // вместо первого операнда вставить результат
      _tokens[operatorIndex - 1] = new Token(LITERAL, result);

      // удалить оператор и второй операнд
      _tokens.splice(operatorIndex, 2);

      this.steps.push(new TokensCollection([..._tokens]));
    }

    return _tokens;
  }

  calc() {
    const binaryCalc = pipe(
      this._collapseMulDiv.bind(this),
      this._collapseAddSub.bind(this),
    );

    return binaryCalc(this.tokens);
  }

}
