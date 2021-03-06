# Math Expression Parser and Graph Builder

![demo screenshot](./demo-pic.jpg "Math Expression Parser and Graph Builder")

**[LIVE DEMO](https://math.lukas-pierce.com/)**

### Features
- Basic Math: 
    - addiction
    - subtraction
    - multiplication
    - division
    - unary minus
    - parentheses
    - exponentiation `^`

- Multiple +- sign combination support: 
    - `1 + -1`
    - `1 + --1`
    - `1 * -1`
    - `1 / +--1`
    - `1 +++ -----1`
    - ...
- Custom functions: `sqrt`, `sin`, `cos`, etc. Easily extensible in: `calculator.js`

```javascript
const custom_fns = {
  sqrt: (a) => Math.sqrt(a),
  plus: (a, b) => a + b,
  round: a => Math.round(a),
  abs: a => Math.abs(a),
  sum: function () {
    let sum = 0;
    [].forEach.call(arguments, (a) => {
      sum += a;
    });
    return sum;
  },

  // trigonometry
  sin: a => Math.sin(a),
  cos: a => Math.cos(a),
  tan: a => Math.tan(a),
  atan: a => Math.atan(a),

  //...

};
```

- Wolfram Alpha as alternative parser
    
### CLI
For run calculator from CLI use:
```
npm run calculator -- --expression="2 * 2"
```
or
```
node cli-calculator --expression="2 * 2"
```
> ⚠️ **Warning**: CLI doesn't support variables. But it’s easy to improve.

### Testing
For testing uses [Jest](https://jestjs.io/):

```
npm run test
```

### TODO 
- validate expression
- expression simplification, prepare before replace variables
