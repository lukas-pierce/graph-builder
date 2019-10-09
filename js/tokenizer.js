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


