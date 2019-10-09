const commandLineArgs = require('command-line-args');
const chalk = require('chalk');
import {Calculator} from "./js/calculator.js";

(() => {
  const options = commandLineArgs([
    {name: 'expression', alias: 'e', type: String, required: true, defaultOption: true},
  ]);

  const expression = (options.expression || '').trim();
  if (!expression) {
    return console.log(chalk.red('Error: expression required'));
  }

  const calculator = new Calculator();
  const res = calculator.calc(expression);
  console.log(res);
})();
