// types.js:

// Load predefined data type validators
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
 * Searches the global list of type handlers for the specified type.
 * @param {string} type - The type to search for.
 * @returns {Object|undefined} The type handler object if found, otherwise undefined.
 */
function find(type) {
  return _types.find((item) => item.type === type);
}

/**
 * Adds a type handler to the global list.
 * @param {string} type - The type to add.
 * @param {Function} parser - The parser function associated with the type.
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
 * Removes the specified type handler from the global array.
 * @param {string} type - The type to remove.
 */
function remove(type) {
  _types = _types.filter((item) => item.type !== type);
}

/**
 * Updates a predefined type parser.
 * @param {string} type - The type to update.
 * @param {Function} parser - The new parser function.
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

function validate(rule, data, errors) {
  const item = find(rule.type);
  if (item) {
    console.log("item");
    console.log(item);
    return item.validator(rule, data, errors);
  } else {
    throw new Error(`"${type}" is not defined`);
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
