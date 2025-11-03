/**
 * LeetCode Problem: Valid Parentheses
 * 
 * Problema: Dada uma string contendo apenas os caracteres '(', ')', '{', '}', '[' e ']',
 * determine se a string de entrada é válida.
 * 
 * Uma string de entrada é válida se:
 * 1. Parênteses abertos devem ser fechados pelo mesmo tipo.
 * 2. Parênteses abertos devem ser fechados na ordem correta.
 * 3. Cada parêntese fechado tem um parêntese aberto correspondente do mesmo tipo.
 * 
 * Categoria: String, Stack
 * 
 * Exemplo:
 * Input: s = "()"
 * Output: true
 * 
 * Input: s = "()[]{}"
 * Output: true
 * 
 * Input: s = "(]"
 * Output: false
 * 
 * Input: s = "([)]"
 * Output: false
 * 
 * Input: s = "{[]}"
 * Output: true
 */

function isValid(s) {
  const openingMap = new Map([["(", 0], ["{", 1], ["[", 2]]);
  const closingMap = new Map([[")", 0], ["}", 1], ["]", 2]]);

  const length = s.length
  const parentheses = []

  if (length == 0) {
    return true;
  }

  for (var i = 0; i < length; i++) {
    const openingIndex = openingMap.get(s[i]);
    const closingIndex = closingMap.get(s[i]);

    if ((openingIndex === undefined) && (closingIndex === undefined)) { 
      return false;
    }
    
    if (openingIndex !== undefined) {
      parentheses.push(openingIndex);
    } else if (closingIndex !== undefined) {
      if (parentheses.length === 0 || parentheses.at(-1) !== closingIndex) {
        return false;
      }
      parentheses.pop();
    } else {
      return false
    }
  }

  return parentheses.length === 0;
}


function findFirstError(s) {
  if (s.length == 0) {
    return { valid: true, error: null, position: 0, character: '' };
  }

  const openingMap = new Map([["(", 0], ["{", 1], ["[", 2]]);
  const closingMap = new Map([[")", 0], ["}", 1], ["]", 2]]);

  const length = s.length
  const parentheses = []

  for (var i = 0; i < length; i++) {
    const openingIndex = openingMap.get(s[i]);
    const closingIndex = closingMap.get(s[i]);
    
    if (openingIndex !== undefined) {
      parentheses.push(openingIndex);
    } else if (closingIndex !== undefined) {
      if (parentheses.length === 0) {
        return { valid: false, error: "Parêntese fechado", position: i, character: s[i] };
      }else if (parentheses.at(-1) !== closingIndex) {
        return { valid: false, error: "não corresponde", position: i, character: s[i] };
      }
      parentheses.pop();
    } else {
      return { valid: false, error: "não corresponde", position: i, character: s[i] };
    }
  }

  if (parentheses.length === 0) {
    return { valid: true, error: null, position: 0, character: '' };
  } else {
    return { valid: false, error: "não foi fechado", position: parentheses.length-1, character: s.at(-1) };
  }
}

module.exports = { isValid, findFirstError };