// validators.js:

// load all necessary modules
const enums = require("./enums.js");
const {
  authRoleParser,
  booleanParser,
  dateParser,
  emailParser,
  enumParser,
  floatParser,
  integerParser,
  passwordParser,
  stringParser,
  timeParser,
} = require("./parsers.js");

/**
 * Validates the value against the specified rule and data.
 * @param {Object} rule - The validation rule object containing the property name and validation settings.
 * @param {Object} data - The data object to validate, which should contain the property specified in the rule.
 * @param {Function} parser - The parser function to convert the data value.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function valueValidator(rule, data, parser, errors) {
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
  if (parser !== undefined) {
    let value = parser(data[rule.name]);

    // If parsing results in null, report error
    if (value === null) {
      errors.push(`"${rule.name}" is not a valid "${rule.type}"`);
      return false;
    }

    // Update data with parsed value
    data[rule.name] = value;
  }

  // Validation succeeded
  return true;
}

/**
 * Validates an authentication role field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function authRoleValidator(rule, data, errors) {
  return valueValidator(rule, data, authRoleParser, errors);
}

/**
 * Validates a boolean field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function booleanValidator(rule, data, errors) {
  return valueValidator(rule, data, booleanParser, errors);
}

/**
 * Compares a specified data property with another for validation.
 * Throws an error if the comparison property name is missing or invalid.
 *
 * @param {Object} rule - The validation rule containing parameters.
 * @param {Object} data - The data object containing values to be compared.
 * @param {Array<string>} errors - An array to collect error messages.
 * @throws {Error} Throws an error if the comparison property name is missing or invalid.
 * @returns {boolean} Returns true if the values are the same, otherwise false.
 */
function compareValidator(rule, data, errors) {
  // Get the property name to compare against
  let compareName = rule.params[0];
  if (!compareName || compareName === "") {
    throw new Error(`"${rule.name}" is missing a comparison property name`);
  }

  // Get the two data values
  let value1 = data[rule.name];
  let value2 = data[compareName];

  // Perform strict comparison of values
  let same = value1 === value2;
  if (!same) {
    errors.push(`"${rule.name}" does not match "${compareName}"`);
  }

  // Return true if the values are the same
  return same;
}

/**
 * Validates a date field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function dateValidator(rule, data, errors) {
  return valueValidator(rule, data, dateParser, errors);
}

/**
 * Validates an email field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function emailValidator(rule, data, errors) {
  return valueValidator(rule, data, emailParser, errors);
}

/**
 * Validates a value against a set of enumerated options.
 * @param {Object} rule - The validation rule object containing the enum parameters.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @throws {Error} - Throws an error if the enum validator is not implemented.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function enumValidator(rule, data, errors) {
  let parser = enumParser(rule.params[0]);
  return valueValidator(rule, data, parser, errors);
}

/**
 * Validates a floating-point number field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function floatValidator(rule, data, errors) {
  return valueValidator(rule, data, floatParser, errors);
}

/**
 * Validates an integer field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function integerValidator(rule, data, errors) {
  return valueValidator(rule, data, integerParser, errors);
}

/**
 * Validates a password field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function passwordValidator(rule, data, errors) {
  return valueValidator(rule, data, passwordParser, errors);
}

/**
 * Validates a value in the data object against a regular expression specified in the rule.
 *
 * @param {Object} rule - The validation rule object.
 * @param {string} rule.name - The name of the rule, used as the key in the data object.
 * @param {Array} rule.params - The parameters for the rule, where the first element is the regex.
 * @param {Object} data - The object containing values to validate.
 * @param {Object} errors - An object to accumulate error messages.
 * @returns {boolean} - Returns true if the value matches the regex, otherwise false.
 * @throws {Error} - Throws an error if the regex is not provided or invalid.
 */
function regexValidator(rule, data, errors) {
  // Ensure a regular expression was provided in rule
  const regexPattern = rule.params[0];
  if (!regexPattern || regexPattern === "") {
    throw new Error(`"${rule.name}" rule is missing regular expression`);
  }

  // Create a RegExp object from the regex pattern
  const regex = new RegExp(regexPattern);

  // return false if valid value is not in data
  if (!valueValidator(rule, data, stringParser, errors)) {
    return false;
  }

  // Test the value against the regular expression
  let matches = regex.test(data[rule.name]);
  if (!matches) {
    errors.push(`"${rule.name} does not match regular expression`);
    return false;
  }

  // return result of regular expression matching
  return matches;
}

/**
 * Validates a string field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function stringValidator(rule, data, errors) {
  if (valueValidator(rule, data, stringParser, errors)) {
    let len = data[rule.name].length;
    console.log("len", len);
    console.log("rule.params", rule.params);
    return true;
  } else {
    return false;
  }
}

/**
 * Validates a time field.
 * @param {Object} rule - The validation rule object.
 * @param {Object} data - The data object to validate.
 * @param {Array<string>} errors - Array to collect validation error messages.
 * @returns {boolean} - Returns true if validation succeeds, false otherwise.
 */
function timeValidator(rule, data, errors) {
  return valueValidator(rule, data, timeParser, errors);
}

// Export all public functions
module.exports = {
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
};
