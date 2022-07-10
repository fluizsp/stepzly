'use strict';
function assign(target, param, value, append = false) {
  let paramFragments = param.split('.');
  let depth = 0;
  let obj = target;
  while (depth < paramFragments.length) {
    let fragment = paramFragments[depth];
    if (depth == paramFragments.length - 1) {
      if (append && typeof (obj[fragment]) === 'object') {
        if (append && Array.isArray(obj[fragment]))
          obj[fragment].push(value);
        if (append && obj[fragment] instanceof (Date))
          obj[fragment] += value
      } else if (append && typeof (obj[fragment]) !== 'object' && typeof (obj[fragment]) !== 'undefined')
        obj[fragment] += value
      else
        obj[fragment] = value;
    } else {
      if (obj[fragment] === undefined) {
        if (isNaN(Number(fragment)))
          obj[fragment] = {}
        else
          obj[fragment] = [{}];
      }
    }
    obj = obj[fragment];
    depth++;
  }
}

function retrieve(target, param) {
  let paramFragments = param.split('.');
  let depth = 0;
  let obj = target;
  while (depth < paramFragments.length) {
    let fragment = paramFragments[depth];
    if (obj[fragment] === undefined)
      return null;
    if (depth == paramFragments.length - 1)
      return obj[fragment];
    obj = obj[fragment];
    depth++;
  }
}

function remove(target, param) {
  let paramFragments = param.split('.');
  let depth = 0;
  let obj = target;
  while (depth < paramFragments.length) {
    let fragment = paramFragments[depth];
    if (depth == paramFragments.length - 1) {
      delete obj[fragment];
    }
    obj = obj[fragment];
    depth++;
  }
}

module.exports = {
  assign,
  remove,
  retrieve
}