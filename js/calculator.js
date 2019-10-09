import './array.js';
import {
  OPERATOR,
  LITERAL,
  LEFT_PARENTHESIS,
  RIGHT_PARENTHESIS,
  VARIABLE,
  FUNCTION,
  Token,
  Tokenizer,
} from './tokenizer.js';

const isAddOperator = token => token.type === OPERATOR && token.value === '+';
const isSubOperator = token => token.type === OPERATOR && token.value === '-';
const isMulOperator = token => token.type === OPERATOR && token.value === '*';
const isDivOperator = token => token.type === OPERATOR && token.value === '/';
const isPowOperator = token => token.type === OPERATOR && token.value === '^';
const isAddOrSubOperator = token => isAddOperator(token) || isSubOperator(token);
const isMulOrDivOperator = token => isMulOperator(token) || isDivOperator(token);
const isMulOrDivOrPowOperator = token => isMulOperator(token) || isDivOperator(token) || isPowOperator(token);
const isLeftParenthesis = token => token.type === LEFT_PARENTHESIS && token.value === '(';
const isRightParenthesis = token => token.type === RIGHT_PARENTHESIS && token.value === ')';
const isParenthesis = token => isLeftParenthesis(token) || isRightParenthesis(token);
const isVariable = token => token.type === VARIABLE;

// операции
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;
const pow = (a, b) => Math.pow(a, b);

// Pipe - последовательный вызов функций на результате предыдущией
const _pipe = (f, g) => (...args) => g(f(...args));
const pipe = (...fns) => fns.reduce(_pipe);

// custom functions
const custom_fns = {
  sqrt: function (num) {
    return Math.sqrt(num)
  },
  plus: function (a, b) {
    return a + b
  },
  round: a => Math.round(a)
};

const custom_fns_names = Object.keys(custom_fns);

export class Calculator {

  /**
   * Схлопывает умножение и деление в последовательности токенов без скобок
   * @param tokens
   * @returns {*}
   * @private
   */
  _collapseMulDivPow(tokens) {
    while (tokens.find(isMulOrDivOrPowOperator)) {
      const operatorIndex = tokens.findIndex(isMulOrDivOrPowOperator);
      const operator = tokens[operatorIndex];
      const operand1 = tokens[operatorIndex - 1];
      const operand2 = tokens[operatorIndex + 1];

      const operation = isMulOperator(operator) ? mul : (isDivOperator(operator) ? div : pow);
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
      this._collapseMulDivPow(tokens)
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

  applyCustomFunction(fnName, tokens) {
    const fn = custom_fns[fnName];
    const args = tokens.filter(t => t.type === LITERAL).map(t => t.value);
    return fn(...args);
  }

  calc(expression, variables = {}) {
    let tokens = Tokenizer.tokenize(expression);
    this._replaceVariables(tokens, variables);

    while (tokens.find(isParenthesis)) {
      // найти индекс последней открывающей скобки
      let left_parentheses_index = tokens.findLastIndex(isLeftParenthesis);
      if (~left_parentheses_index) {

        // найти первую закрывающую скобку идущую после найденой откварющей скобки
        const right_parentheses_index = tokens.findIndexFrom(isRightParenthesis, left_parentheses_index + 1);

        // вычисляем внутренние токены которые уже без скобок
        const inside_tokens = tokens.slice(left_parentheses_index + 1, right_parentheses_index);
        let result_tokens = this._calcNoParentheses(inside_tokens);

        // replace inside tokens
        const before_tokens = tokens.slice(0, left_parentheses_index);
        const after_tokens = tokens.slice(right_parentheses_index + 1);


        // проверяем предыдущий токен является функцией
        const prevToken = before_tokens[before_tokens.length - 1];
        if (prevToken && prevToken.type === FUNCTION && custom_fns_names.includes(prevToken.value)) {
          const fnName = prevToken.value;
          const res = this.applyCustomFunction(fnName, result_tokens);
          result_tokens = [new Token(LITERAL, res)];
          before_tokens.splice(before_tokens.length - 1, 1);
        }

        tokens = [...before_tokens, ...result_tokens, ...after_tokens];
      }
    }

    return this._calcNoParentheses(tokens)[0].value;
  }

}

export class CalculatorError extends Error {
}
