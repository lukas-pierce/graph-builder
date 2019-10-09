// token types
export const OPERATOR = 'OPERATOR';
export const FUNCTION = 'FUNCTION';
export const LEFT_PARENTHESIS = 'LEFT_PARENTHESIS';
export const RIGHT_PARENTHESIS = 'RIGHT_PARENTHESIS';
export const FUNCTION_ARGUMENT_SEPARATOR = 'FUNCTION_ARGUMENT_SEPARATOR';
export const VARIABLE = 'VARIABLE';
export const LITERAL = 'LITERAL';

export class Tokenizer {

  static tokenize(str) {
    str = str.replace(/\s+/g, "");

    // если строка начинается с плюса или минуса, то добавить в начале 0
    if (/^[+-]/.test(str)) {
      str = '0' + str;
    }

    // если стрка заканчивается плюсом или минусом, то добавать в конец 0
    if (/[+-]$/.test(str)) {
      str = str + '0';
    }

    str = str.split("");

    const result = [];
    let letterBuffer = [];
    let numberBuffer = [];

    str.forEach(function (char) {
      if (isDigit(char)) {
        numberBuffer.push(char);
      } else if (char === ".") {
        numberBuffer.push(char);
      } else if (isLetter(char)) {
        if (numberBuffer.length) {
          emptyNumberBufferAsLiteral();
          result.push(new Token(OPERATOR, "*"));
        }
        letterBuffer.push(char);
      } else if (isOperator(char)) {
        emptyNumberBufferAsLiteral();
        emptyLetterBufferAsVariables();
        result.push(new Token(OPERATOR, char));
      } else if (isLeftParenthesis(char)) {
        if (letterBuffer.length) {
          result.push(new Token(FUNCTION, letterBuffer.join("")));
          letterBuffer = [];
        } else if (numberBuffer.length) {
          emptyNumberBufferAsLiteral();
          result.push(new Token(OPERATOR, "*"));
        }
        result.push(new Token(LEFT_PARENTHESIS, char));
      } else if (isRightParenthesis(char)) {
        emptyLetterBufferAsVariables();
        emptyNumberBufferAsLiteral();
        result.push(new Token(RIGHT_PARENTHESIS, char));
      } else if (isComma(char)) {
        emptyNumberBufferAsLiteral();
        emptyLetterBufferAsVariables();
        result.push(new Token(FUNCTION_ARGUMENT_SEPARATOR, char));
      }
    });

    if (numberBuffer.length) {
      emptyNumberBufferAsLiteral();
    }

    if (letterBuffer.length) {
      emptyLetterBufferAsVariables();
    }

    this._resolveAddSub(result);

    return result;

    function emptyLetterBufferAsVariables() {
      let l = letterBuffer.length;
      for (let i = 0; i < l; i++) {
        result.push(new Token(VARIABLE, letterBuffer[i]));
        if (i < l - 1) { // there are more Variables left
          result.push(new Token(OPERATOR, "*"));
        }
      }
      letterBuffer = [];
    }

    function emptyNumberBufferAsLiteral() {
      if (numberBuffer.length) {
        result.push(new Token(LITERAL, numberBuffer.join("")));
        numberBuffer = [];
      }
    }
  }


  /**
   * Принцип работы этого метода:
   * 1. Найти позицию комбинации двух операторов: любой затем минус или минус (startIndex)
   * 2. Начиная с позиции найденой на шаге 1 искать позицию первого плюса или минуса включая исходную позицию (startSignIndex)
   * 3. Начиная с позиции найденой на шаге 2 искать позицию токена не являющегося плюсом или минусом
   * 4. Для последлватьельность токенов +-+--- вычисляем знак испольязу умножение +1 и -1
   * 5. Замеменям последовательность опрераторов начиная с startSignIndex:
   *      - если комбинация на шаге 1 начиналась с плюса или минуса: то заменяем на токены ['+', 'знак', '*']
   *      - если комбинация на шаге 1 начиналась с другого оператора: то заменяем на токены ['знак', '*']
   *    где 'знак' - это +1 или -1
   *
   * @param tokens
   */
  static _resolveAddSub(tokens) {
    const isOperator = token => token.type === OPERATOR;
    const isAddOrSubOperator = token => token.type === OPERATOR && ['+', '-'].includes(token.value);

    // найти начало комбинации токенов когда идет любой операторт а потом оператор сложения или вычитания
    const getStartIndex = tokes => tokens.findIndex((token, index) => {
      if (isOperator(token)) {
        const nextToken = tokens[index + 1];
        if (nextToken && isAddOrSubOperator(nextToken)) {
          return true
        }
      }
      return false
    });

    let startIndex;
    do {
      startIndex = getStartIndex(tokens);

      if (~startIndex) {
        const startSignIndex = tokens.findIndexFrom(isAddOrSubOperator, startIndex);
        const endIndex = tokens.findIndexFrom(token => !isAddOrSubOperator(token), startSignIndex);

        let sign = 1;
        for (let i = startSignIndex; i < endIndex; i++) {
          const signToken = tokens[i];
          if (signToken.value === '+') {
            sign *= 1
          } else {
            sign *= -1
          }
        }

        const signToken = new Token(LITERAL, sign);
        const multiple = new Token(OPERATOR, '*');

        const insertTokes = [signToken, multiple];
        if (startSignIndex === startIndex) {
          const plus = new Token(OPERATOR, '+');
          insertTokes.unshift(plus)
        }

        const removeCount = endIndex - startSignIndex;
        tokens.splice(startSignIndex, removeCount, ...insertTokes);
      }

    } while (~startIndex);

  }
}

export class Token {
  constructor(type, value) {
    this.type = type;

    if (isInt(value)) {
      this.value = parseInt(value);
    } else if (isFloat(value)) {
      this.value = parseFloat(value)
    } else {
      this.value = value;
    }
  }
}

export class TokensCollection {
  constructor(tokens) {
    this.tokens = tokens;
  }

  toDetailString() {
    const lines = this.tokens.reduce(function (arr, token, index) {
      const line = index + " => " + token.type + "(" + token.value + ")";
      arr.push(line);
      return arr;
    }, []);
    return lines.join('\n');
  }

  toString() {
    return this.tokens.map(t => t.value).join(' ');
  }
}

function isComma(ch) {
  return /,/.test(ch);
}

function isDigit(ch) {
  return /\d/.test(ch);
}

function isInt(str) {
  return /^\d+$/.test(str)
}

function isFloat(str) {
  return /^[+-]?\d+(\.\d+)?$/.test(str)
}

function isLetter(ch) {
  return /[a-z]/i.test(ch);
}

function isOperator(ch) {
  return /[+\-*\/^]/.test(ch); // + - * / ^
}

function isLeftParenthesis(ch) {
  return /\(/.test(ch);
}

function isRightParenthesis(ch) {
  return /\)/.test(ch);
}


