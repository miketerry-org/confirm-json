// validators.js:

/**
 * Module for managing predefined data types and their validators.
 *
 * This module provides a set of predefined data types that can be used in validation rules.
 * Each data type is associated with a specific validator function that follows the convention:
 * the first part of the parser function name corresponds to the type string specified in the rules.
 *
 * Predefined Data Types:
 * - `authRole`: Validator for authentication roles.
 * - `boolean`: Validator for boolean values.
 * - `compare`: Validator for comparing values.
 * - `date`: Validator for date values.
 * - `email`: Validator for email addresses.
 * - `enum`: Validator for enumerated values.
 * - `float`: Validator for floating-point numbers.
 * - `integer`: Validator for integer values.
 * - `password`: Validator for password strength.
 * - `regex`: Validator for regular expressions.
 * - `string`: Validator for string values.
 * - `time`: Validator for time values.
 *
 * Use the `validate` function to validate data against a specified rule using the appropriate validator.
 * The `rule.type` must match one of the predefined types listed above.
 *
 * @module types
 */

const {
  authRoleValidator,
  booleanValidator,
  compareValidator,
  dateValidator,
  emailValidator,
  enumValidator,
  floatValidator,
  integerValidator,
  passwordValidator,
  regexValidator,
  stringValidator,
  timeValidator,
} = require("./validators.js");

// Global array of data type handlers
let _types = [];

/**
 * Adds a type handler to the global list.
 * @param {string} type - The type to add.
 * @param {Function} validator - The validator function associated with the type.
 * @throws {Error} If the type is already defined.
 */
function add(type, validator) {
  if (find(type) === undefined) {
    _types.push({ type, validator });
  } else {
    throw new Error(`"${type}" is already defined`);
  }
}

/**
 * Searches the global list of type handlers for the specified type.
 * @param {string} type - The type to search for.
 * @returns {Object|undefined} The type handler object if found, otherwise undefined.
 */
function find(type) {
  return _types.find((item) => item.type === type);
}

/**
 * Removes the specified type handler from the global array.
 * @param {string} type - The type to remove.
 */
function remove(type) {
  _types = _types.filter((item) => item.type !== type);
}

/**
 * Updates a predefined type parser.
 * @param {string} type - The type to update.
 * @param {Function} validator - The new parser function.
 * @throws {Error} If the type is not defined.
 */
function update(type, validator) {
  const item = find(type);
  if (item) {
    item.validator = validator;
  } else {
    throw new Error(`"${type}" is not defined`);
  }
}

/**
 * Validates data against a specified rule using a validator function.
 * @param {Object} rule - The rule object containing type and validator.
 * @param {*} data - The data to be validated.
 * @param {Array} errors - Array to store validation errors.
 * @throws {Error} Throws an error if the type specified in rule is not defined.
 * @returns {*} Returns the result of the validation.
 */
function validate(rule, data, errors) {
  const item = find(rule.type);
  if (item) {
    return item.validator(rule, data, errors);
  } else {
    throw new Error(`"${rule.type}" is not defined`);
  }
}

// Define standard data types
add("authRole", authRoleValidator);
add("boolean", booleanValidator);
add("compare", compareValidator);
add("date", dateValidator);
add("email", emailValidator);
add("enum", enumValidator);
add("float", floatValidator);
add("integer", integerValidator);
add("password", passwordValidator);
add("regex", regexValidator);
add("string", stringValidator);
add("time", timeValidator);

// Export all public functions
module.exports = {
  add,
  find,
  get length() {
    return _types.length;
  },
  remove,
  update,
  validate,
};
