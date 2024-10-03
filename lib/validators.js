// validators.js

const {
  parseAuthRole,
  parseBoolean,
  parseDate,
  parseEmail,
  parsePassword,
  parseTime,
  parseInteger,
  parseString,
} = require("./parsers.js");

/**
 * Validates the value against the specified rule and data.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Function} parser - The parser function to convert data value.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validValue(rule, data, parser, errors) {
  // Check if data has the specified property
  if (!data.hasOwnProperty(rule.name)) {
    // If required and property is missing, add error
    if (rule.required) {
      errors.push(`"${rule.name}" is required`);
      return false;
    } else {
      // Assign default value if not required
      data[rule.name] = rule.defaultValue;
      return true;
    }
  }

  // Parse the value from data using the parser function
  let value = parser(data[rule.name]);

  // If parsing results in NaN, report error
  if (isNaN(value)) {
    errors.push(`"${rule.name}" is not a valid "${rule.type}"`);
    return false;
  }

  // Validation succeeded
  return true;
}

/**
 * Validates an authentication role field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validAuthRole(rule, data, errors) {
  return validValue(rule, data, parseAuthRole, errors);
}

/**
 * Validates a boolean field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validBoolean(rule, data, errors) {
  return validValue(rule, data, parseBoolean, errors);
}

/**
 * Placeholder function for a compare validator (not implemented).
 * @throws {Error} - Throws an error indicating validator is not implemented.
 */
function validCompare() {
  throw new Error(`"compare" validator not implemented`);
}

/**
 * Validates a date field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validDate(rule, data, errors) {
  return validValue(rule, data, parseDate, errors);
}

/**
 * Validates an email field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validEmail(rule, data, errors) {
  return validValue(rule, data, parseEmail, errors);
}

/**
 * Placeholder function for an enum validator (not implemented).
 * @throws {Error} - Throws an error indicating validator is not implemented.
 */
function validEnum() {
  throw new Error(`"Enum" validator not implemented`);
}

/**
 * Validates a floating-point number field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validFloat(rule, data, errors) {
  return validValue(rule, data, parseFloat, errors);
}

/**
 * Validates an integer field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validInteger(rule, data, errors) {
  return validValue(rule, data, parseInteger, errors);
}

/**
 * Validates an password field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validPassword(rule, data, errors) {
  return validValue(rule, data, parsePassword, errors);
}

/**
 * Placeholder function for a regular expression validator (not implemented).
 * @throws {Error} - Throws an error indicating validator is not implemented.
 */
function validRegEx() {
  throw new Error(`"RegEx" validator not implemented`);
}

/**
 * Validates a string field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validString(rule, data, errors) {
  return validValue(rule, data, parseString, errors);
}

/**
 * Validates a time field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array} errors - Array to collect validation errors.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function validTime(rule, data, errors) {
  return validValue(rule, data, parseTime, errors);
}

// Export all public functions
module.exports = {
  validAuthRole,
  validBoolean,
  validCompare,
  validDate,
  validEmail,
  validEnum,
  validFloat,
  validInteger,
  validPassword,
  validRegEx,
  validString,
  validTime,
};
