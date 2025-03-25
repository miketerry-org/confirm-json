// index.js:

"use strict";

// load all necessary modules
const MoreDate = require("moreDate");

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
function getPasswordRegEx(config) {
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

/**
 * Capitalizes the first letter of each word in the string and makes the rest lowercase.
 * @param {string} str - The string to convert to title case.
 * @returns {string} - The string with each word's first letter capitalized.
 */
function titleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Capitalizes the first letter of the string and makes the rest lowercase.
 * @param {string} str - The string to convert to first case.
 * @returns {string} - The string with the first letter capitalized and the rest in lowercase.
 */
function firstCase(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Class to check the validity of various data types and values.
 */
class Check {
  #data = [];
  #errors = [];

  /**
   * Constructor for Check class.
   * @param {Object} data - The data to be validated.
   */
  constructor(data) {
    this.#data = data;
  }

  /**
   * Verifies that the value is a boolean.
   * @param {string} name - The name of the field.
   * @param {boolean} defaultValue - The default value of the field.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isBoolean(name, defaultValue, required = true) {
    // first try to get value
    let value = this._getValue(name, defaultValue, required);

    // if no value and no default provided
    if (value === undefined) {
      return this;
    }

    // get the type of value
    let type = typeof value;

    // if the value is a string
    if (type === "string") {
      // declare array of true and false values
      const trueValues = [true, "true", "t", "yes", "y", "on"];
      const falseValues = [false, "false", "f", "F", "no", "n", "off"];

      // convert the value to a lowercase
      value = value.toLowerCase();

      // assign true/false if value is in one of the arrays
      if (trueValues.includes(value)) {
        this.#data[name] = true;
      } else if (falseValues.includes(value)) {
        this.#data[name] = false;
      } else {
        this.#errors.push(
          `"${name} "is ${value}" wich is not a valid "boolean" value`
        );
      }
      // if value is of type number
    } else if (type === "number") {
      // if it is the whole integer of 1 then it is true
      if (value === 1) {
        this.#data[name] = true;
      } else if (value === 0) {
        // if it is the whole number 0 then it is false
        this.#data[name] = false;
      } else {
        // the number is not 1 or 0 so it is invalid
        this.#errors.push(
          `"${name} "is ${value}" wich is not a valid "boolean" value`
        );
      }
    } else if (type !== "boolean") {
      // the value is not a boolean, not a string and not a number so it is invalid
      this.#errors.push(
        `"${name} "is ${value}" wich is not a valid "boolean" value`
      );
    }

    // allow for method chaining
    return this;
  }

  /**
   * Verifies that the value is a valid date.
   * @param {string} name - The name of the field.
   * @param {Date} defaultValue - The default value of the field.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isDate(name, defaultValue, required = true) {
    // first try to get value
    let value = this._getValue(name, defaultValue, required);

    // if no value and no default provided
    if (value === undefined) {
      return this;
    }

    // now attempt to parse the value into a Date object
    value = MoreDate.parseDate(value);

    // if able to convert to date then update data
    if (MoreDate.isDate(value)) {
      this.#data[name] = value;
    } else {
      // add error message to array
      this.#errors.push(`"${name}" is not a valid date`);
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that two values are equal.
   * @param {string} name - The name of the field.
   * @param {string} duplicateName - The name of the duplicate field to compare.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isDuplicate(name, duplicateName, required = true) {
    // First try to get both values
    let value1 = this._getValue(name, undefined, required);
    let value2 = this._getValue(duplicateName, undefined, required);

    // Exit if either value is undefined or null (handling both cases)
    if (value1 == null || value2 == null) {
      // `value == null` checks both `null` and `undefined`
      this.#errors.push(
        `Both "${name}" and "${duplicateName}" values are required`
      );
      return this;
    }

    // Check if both values are of type Date and compare them
    if (value1 instanceof Date && value2 instanceof Date) {
      if (value1.getTime() !== value2.getTime()) {
        this.#errors.push(`"${name}" and "${duplicateName}" do not match`);
      }
      return this; // Allow for method chaining
    }

    // Check if both values have the same primitive data type
    if (typeof value1 !== typeof value2) {
      this.#errors.push(`"${name}" and "${duplicateName}" do not match`);
      return this; // Allow for method chaining if types don't match
    }

    // If they are of the same primitive type, compare the values directly
    if (value1 !== value2) {
      this.#errors.push(`"${name}" and "${duplicateName}" do not match`);
    }

    // Allow method chaining
    return this;
  }

  /**
   * Verifies that the value is a valid email.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isEmail(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    // if value defined and it is a string
    if (value && this._checkType(name, value, "string")) {
      // use regular expression to determine if email is valid
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(value)) {
        this.#errors.push(`"${name} is not a valid email`);
      }
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that the value is a valid enumeration.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {Array<string>} values - The valid enumeration values.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isEnum(name, defaultValue, values, required = true) {
    //get the value or default if necessary
    let value = this._getValue(name, defaultValue, required);

    // if value defined and it is a string
    if (value && this._checkType(name, value, "string")) {
      // if value is not valid enumeration
      if (!values.find((item) => item.toLowerCase() === value.toLowerCase())) {
        this.#errors.push(`${name} is "${value}" which is not a valid value`);
      }
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that the value is a valid float.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {number} minFloat - The minimum allowed float value.
   * @param {number} maxFloat - The maximum allowed float value.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isFloat(name, defaultValue, minFloat, maxFloat, required = true) {
    // get value or default if one is specified
    let value = this._getValue(name, defaultValue, required);

    // if value found and it is a string
    if (value && typeof value === "string") {
      // try to parse string into floating point number
      value = parseFloat(value);

      // if conversion was successful, then update value in data object
      if (!isNaN(value)) {
        this.#data[name] = value;
      } else {
        // not a valid number so push error an return method chaining
        this.#errors.push(
          `"${name}" is "${value}" which is not a valid number`
        );
        return this;
      }
    }

    // if value is defined an it is now a number
    if (value && this._checkType(name, value, "number")) {
      // ensure value is within min and ma values
      if (minFloat && minFloat > value) {
        this.#errors.push(`"${name}" cannot be less than "${minFloat}"`);
      } else if (maxFloat && maxFloat < value) {
        this.#errors.push(`"${name}" cannot be greater than "${maxFloat}"`);
      }
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that the value is an integer.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {number} minInteger - The minimum allowed integer value.
   * @param {number} maxInteger - The maximum allowed integer value.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isInteger(name, defaultValue, minInteger, maxInteger, required = true) {
    // get the value or default if one is specified
    let value = this._getValue(name, defaultValue, required);

    // if value found and it is a string
    if (value && typeof value === "string") {
      // try to parse string into integer number
      value = parseInt(value);

      // if conversion was successful, then update value in data object
      if (!isNaN(value)) {
        this.#data[name] = value;
      } else {
        // not a valid number so push error an return method chaining
        this.#errors.push(
          `"${name}" is "${value}" which is not a valid number`
        );
        return this;
      }
    }

    // if a number then ensure it is between min and max
    if (value && this._checkType(name, value, "number")) {
      if (minInteger && minInteger > value) {
        this.#errors.push(`"${name}" cannot be less than "${minInteger}"`);
      } else if (maxInteger && maxInteger < value) {
        this.#errors.push(`"${name}" cannot be greater than "${maxInteger}"`);
      }
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that the value is a valid password.
   * @param {string} name - The name of the field.
   * @param {Object} config - Configuration for password validation.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isPassword(name, config = {}, required = true) {
    // get value
    let value = this._getValue(name, undefined, required);

    // assume an invalid password
    let ok = false;

    // if value found and it is a string
    if (value && this._checkType(name, value, "string")) {
      // merge the default password configuration with those passed to method
      const mergedConfig = { ...defaultPasswordConfig, ...config };

      // count types of characters
      const counts = countCharacters(value);

      // ensure length is within bounds and each character type meets minimum requirements
      ok =
        value.length >= mergedConfig.minLength &&
        value.length <= mergedConfig.maxLength &&
        counts.upper >= mergedConfig.minUpper &&
        counts.lower >= mergedConfig.minLower &&
        counts.digits >= mergedConfig.minDigits &&
        counts.symbols >= mergedConfig.minSymbols;
    }

    // if password does not meet requirements
    if (!ok) {
      this.#errors.push(`"${name}" is not a valid password value`);
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that the value matches a given regular expression.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {RegExp} regEx - The regular expression to test against.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isRegEx(name, defaultValue, regEx, required = true) {
    // get the value or default if no value present in data
    //  value = this._getValue(name, defaultValue, required);

    // if value exists and it is a string value
    if (value && this._checkType(name, value, "string")) {
      // if value does not match regular expression
      if (!regEx.test(value)) {
        this.#errors.push(`"${name}" is "${value}" which is not a valid value`);
      }
    }

    // allow method chaining
    return this;
  }

  /**
   * Verifies that the value is a valid string with optional length and capitalization constraints.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {number} minLength - The minimum length of the string.
   * @param {number} maxLength - The maximum length of the string.
   * @param {string} capitalization - The capitalization rule (e.g., "upper", "lower", "title", "first").
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isString(
    name,
    defaultValue,
    minLength,
    maxLength,
    capitalization = undefined,
    required = true
  ) {
    // get value or default if no value specified
    let value = this._getValue(name, defaultValue, required);

    // if value present and value is a strring
    if (value && this._checkType(name, value, "string")) {
      // ensure length of value is within min and max lengths
      let len = value.length;
      if (minLength && minLength > len) {
        this.#errors.push(`"${name}" must be at least ${minLength} characters`);
      } else if (maxLength && maxLength < len) {
        this.#errors.push(
          `"${name}" must be no more than ${maxLength} characters`
        );
      }

      // if a form of capitalization  was specified then convert value
      if (capitalization) {
        if (capitalization === "upper") {
          this.#data[name] = value.toUpperCase();
        } else if (capitalization === "lower") {
          this.#data[name] = value.toLowerCase();
        } else if (capitalization === "title") {
          this.#data[name] = titleCase(value);
        } else if (capitalization === "first") {
          this.#data[name] = firstCase(value);
        } else {
          throw new Error(
            `"${name}" cannot be converted to "${capitalization}" because it is not a valid form of capitalization`
          );
        }
      }
    }

    // allow for method chaining
    return this;
  }

  /**
   * Returns an array of error messages.
   * @returns {Array<string>} - The list of error messages.
   */
  get errors() {
    return this.#errors;
  }

  /**
   * Checks if the data type of the value is as expected.
   * @param {string} name - The name of the field.
   * @param {*} value - The value to check.
   * @param {string} expectedType - The expected type.
   * @returns {boolean} - True if the types match, false otherwise.
   */
  _checkType(name, value, expectedType) {
    let actualType = typeof value;
    let same = expectedType === actualType;
    if (!same) {
      this.#errors.push(
        `"${name}" is of type "${actualType}" but should be of type "${expectedType}"`
      );
    }

    return same;
  }

  /**
   * Returns the value of the field or a default value if it doesn't exist.
   * @param {string} name - The name of the field.
   * @param {*} defaultValue - The default value to return if the field is missing.
   * @param {boolean} required - Whether the field is required.
   * @returns {*} - The field value or the default value.
   */
  _getValue(name, defaultValue, required) {
    let value = this.#data[name];

    // if the value is undefined
    if (value === undefined) {
      // if there is a default value then assign it to internal data object and value being returned
      if (defaultValue) {
        this.#data[name] = defaultValue;
        value = defaultValue;
      } else if (required) {
        // value is required and it was not provided
        this.#errors.push(`"${name} field is required.`);
      }
    }

    return value;
  }
}

// export the Check class
module.exports = Check;
