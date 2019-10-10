require = require('esm')(module);
const commandLineArgs = require('command-line-args');
const chalk = require('chalk');
const {Calculator, CalculatorError} = require('./js/calculator.js');

(() => {
  const options = commandLineArgs([
    {name: 'expression', alias: 'e', type: String, required: true, defaultOption: true},
  ]);

  const expression = (options.expression || '').trim();
  if (!expression) {
    return console.log(chalk.red('Error: expression required'));
  }

  try {
    const calculator = new Calculator();
    const res = calculator.calc(expression);
    console.log(chalk.green(res));
  } catch (e) {
    if (e instanceof CalculatorError) {
      console.log(chalk.red('CalculatorError: ' + e.message));
    } else throw e;
  }

})();
