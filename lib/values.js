'use strict';
const convert = (value, conversion) => {
  let returnValue = null;
  if (value === null || value === undefined)
    return value;
  switch (conversion) {
    case 'toString':
      returnValue = String(value);
      if (value instanceof Date)
        returnValue = value.toISOString();
      break;
    case 'toNumber':
      returnValue = Number(value);
      if (value instanceof Date)
        returnValue /= 1000;
      break;
    case 'toBoolean':
      if (typeof value === 'string')
        returnValue = value.toLowerCase() === "true";
      if (typeof value === 'number')
        returnValue = Boolean(value);
      break;
    case 'toDate':
      if (typeof value === 'number')
        value *= 1000;
      returnValue = new Date(value);
      break;
  };
  return returnValue;
};
const calculate = (valueA, valueB, operator) => {
  let returnValue = null;
  valueA = Number(valueA);
  valueB = Number(valueB);
  if (isNaN(valueA) || isNaN(valueB))
    return NaN;
  switch (operator) {
    case '+':
      returnValue = valueA + valueB;
      break;
    case '-':
      returnValue = valueA - valueB;
      break;
    case '*':
      returnValue = valueA * valueB;
      break;
    case '/':
      returnValue = valueA / valueB;
      break;
    case '%':
      returnValue = valueA % valueB;
      break;
  };
  return returnValue;
};

const split = (value, separator) => {
  let splittedValue = [];
  if (typeof value === 'string')
    splittedValue = value.split(separator);
  return splittedValue;
};

const join = (value, separator) => {
  let joinedValue = '';
  if (Array.isArray(value))
    joinedValue = value.join(separator);
  return joinedValue;
};

const extract = (value, expression, expressionOptions) => {
  if (!expressionOptions)
    expressionOptions = {};
  let extractedData = null;
  let options = '';
  options = expressionOptions.ignoreCase ? options + 'i' : options;
  options = expressionOptions.global ? options + 'g' : options;
  options = expressionOptions.multiline ? options + 'm' : options;
  let regExExpr = new RegExp(expression, options);
  extractedData = regExExpr.exec(value);
  return extractedData;
};

const compare = (a, b, operator) => {
  if (typeof a === 'number')
    b = Number(b);
  else if (typeof a === 'boolean')
    b = Boolean(b);
  else if (a instanceof Date)
    b = new Date(b);
  else if (typeof a === 'object') {
    a = JSON.stringify(a);
    b = JSON.stringify(b);
  };
  let comparisonSatisfied = false;
  switch (operator.toLowerCase()) {
    case 'equals':
      comparisonSatisfied = a === b;
      break;
    case 'notequals':
      comparisonSatisfied = a !== b;
      break;
    case 'greater':
      comparisonSatisfied = a > b;
      break;
    case 'greaterorequals':
      comparisonSatisfied = a >= b;
      break;
    case 'lesser':
      comparisonSatisfied = a < b;
      break;
    case 'lesserorequals':
      comparisonSatisfied = a <= b;
      break;
    case 'contains':
      comparisonSatisfied = a.indefOf(b) >= 0;
      break;
    case 'isset':
      comparisonSatisfied = a !== undefined && a !== null;
  }
  return comparisonSatisfied;
};

const replace = (obj, searchValue, replaceValue) => {
  for (let attr in obj) {
    if (typeof obj[attr] === 'string')
      obj[attr] = obj[attr].replace(searchValue, replaceValue);
    if (typeof obj[attr] === 'object' || typeof obj[attr] === 'array')
    replace(obj[attr], searchValue, replaceValue);
  }
};

module.exports = {
  convert,
  compare,
  replace,
  calculate,
  split,
  join,
  extract
}