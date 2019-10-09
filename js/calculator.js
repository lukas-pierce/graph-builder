import './array.js';
import {
  OPERATOR,
  LITERAL,
  LEFT_PARENTHESIS,
  RIGHT_PARENTHESIS,
  VARIABLE,
  Token,
  TokensCollection
} from "./tokenizer.js";

const isAddOperator = token => token.type === OPERATOR && token.value === '+';
const isSubOperator = token => token.type === OPERATOR && token.value === '-';
const isMulOperator = token => token.type === OPERATOR && token.value === '*';
const isDivOperator = token => token.type === OPERATOR && token.value === '/';
const isAddOrSubOperator = token => isAddOperator(token) || isSubOperator(token);
const isMulOrDivOperator = token => isMulOperator(token) || isDivOperator(token);
const isLeftParenthesis = token => token.type === LEFT_PARENTHESIS && token.value === '(';
const isRightParenthesis = token => token.type === RIGHT_PARENTHESIS && token.value === ')';
const isParenthesis = token => isLeftParenthesis(token) || isRightParenthesis(token);
const isVariable = token => token.type === VARIABLE;

// операции
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;

// Pipe - последовательный вызов функций на результате предыдущией
const _pipe = (f, g) => (...args) => g(f(...args));
const pipe = (...fns) => fns.reduce(_pipe);

export class Calculator {

  /**
   * Схлопывает умножение и деление в последовательности токенов без скобок
   * @param tokens
   * @returns {*}
   * @private
   */
  _collapseMulDiv(tokens) {
    while (tokens.find(isMulOrDivOperator)) {
      const operatorIndex = tokens.findIndex(isMulOrDivOperator);
      const operator = tokens[operatorIndex];
      const operand1 = tokens[operatorIndex - 1];
      const operand2 = tokens[operatorIndex + 1];

      const operation = isMulOperator(operator) ? mul : div;
      const result = operation(operand1.value, operand2.value);

      // вместо первого операнда вставить результат
      tokens[operatorIndex - 1] = new Token(LITERAL, result);

      // удалить оператор и второй операнд
      tokens.splice(operatorIndex, 2);
    }

    return tokens;
  }

  /**
   * Схлопывает сложение и вычитание в последовательности токенов без скобок
   * @param tokens
   * @returns {*}
   * @private
   */
  _collapseAddSub(tokens) {
    while (tokens.find(isAddOrSubOperator)) {
      const operatorIndex = tokens.findIndex(isAddOrSubOperator);
      const operator = tokens[operatorIndex];
      const operand1 = tokens[operatorIndex - 1];
      const operand2 = tokens[operatorIndex + 1];

      const operation = isAddOperator(operator) ? add : sub;
      const result = operation(operand1.value, operand2.value);

      // вместо первого операнда вставить результат
      tokens[operatorIndex - 1] = new Token(LITERAL, result);

      // удалить оператор и второй операнд
      tokens.splice(operatorIndex, 2);
    }

    return tokens;
  }

  _calcNoParentheses(tokens) {
    return this._collapseAddSub(
      this._collapseMulDiv(tokens)
    );
  }

  _replaceVariables(tokens, variablesMap = {}) {
    const variablesNames = Object.keys(variablesMap);
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (isVariable(token)) {
        const variableName = token.value;
        if (variablesNames.includes(variableName)) {
          const variableValue = variablesMap[variableName];
          tokens[i] = new Token(LITERAL, variableValue);
        } else {
          throw new CalculatorError(`undefined variable in expression: <b>${variableName}</b>`);
        }
      }
    }
  }

  calc(tokens, variables = {}) {
    this._replaceVariables(tokens, variables);
    console.log(tokens);
    return;

    while (tokens.find(isParenthesis)) {
      // найти индекс последней открывающей скобки
      let left_parentheses_index = tokens.findLastIndex(isLeftParenthesis);
      if (~left_parentheses_index) {

        // найти первую закрывающую скобк идущую после найденой откварющей скобки
        const right_parentheses_index = tokens.findIndexFrom(isRightParenthesis, left_parentheses_index + 1);

        // вычисляем внутренние токены которые уже без скобок
        const inside_tokens = tokens.slice(left_parentheses_index + 1, right_parentheses_index);
        const result_tokens = this._calcNoParentheses(inside_tokens);

        // replace inside tokens
        const before_tokes = tokens.slice(0, left_parentheses_index);
        const after_tokes = tokens.slice(right_parentheses_index + 1);
        tokens = [...before_tokes, ...result_tokens, ...after_tokes];
      }
    }

    return this._calcNoParentheses(tokens);
  }

}

export class CalculatorError extends Error {
}
