// passwords.js:

"use strict";

// Default configuration values for password validation
const defaultPasswordConfig = {
  minLength: 12,
  maxLength: 100,
  minUpper: 1,
  minLower: 1,
  minDigits: 1,
  minSymbols: 1,
};

// function to count occurances of character types
function countCharacters(value) {
  // Initialize counters for each category
  let result = {
    upper: 0,
    lower: 0,
    digits: 0,
    symbols: 0,
  };

  // Loop through each character in the string
  for (let char of value) {
    if (/[A-Z]/.test(char)) {
      // If the character is an uppercase letter
      result.upper++;
    } else if (/[a-z]/.test(char)) {
      // If the character is a lowercase letter
      result.lower++;
    } else if (/\d/.test(char)) {
      // If the character is a digit
      result.digits++;
    } else if (/[^A-Za-z0-9]/.test(char)) {
      // If the character is not a letter or a digit (i.e., a symbol)
      result.symbols++;
    }
  }

  return result;
}

/**
 * Returns a regular expression to validate passwords based on configuration values.
 * @param {Object} config - Configuration object for password validation.
 * @returns {RegExp} - The regex pattern for validating the password.
 */
function makePasswordRegEx(config) {
  const minLength = config.minLength;
  const maxLength = config.maxLength;
  const minUppercase = config.minUppercase;
  const minLowercase = config.minLowercase;
  const minDigits = config.minDigits;
  const minSymbols = config.minSymbols;

  const uppercase = `(?=.*[A-Z]{${minUppercase},})`; // At least 'minUppercase' uppercase letters
  const lowercase = `(?=.*[a-z]{${minLowercase},})`; // At least 'minLowercase' lowercase letters
  const digits = `(?=.*\d{${minDigits},})`; // At least 'minDigits' digits
  const symbols = `(?=.*[!@#$%^&*()_+=[\\]{};':"\\\\|,.<>/?-]{${minSymbols},})`; // At least 'minSymbols' special characters

  const regExPattern = `^${uppercase}${lowercase}${digits}${symbols}.{${minLength},${maxLength}}$`;

  return new RegExp(regExPattern);
}

module.exports = {
  config: defaultPasswordConfig,
  countCharacters,
  makePasswordRegEx,
};
