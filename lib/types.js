// types.js

// Load predefined data type validators
const {
  validAuthRole,
  validBoolean,
  validCompare,
  validDate,
  validEmail,
  validEnum,
  validFloat,
  validInteger,
  validPassword,
  validRegex,
  validString,
  validTime,
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

// Define standard data types
add("authRole", validAuthRole);
add("boolean", validBoolean);
add("compare", validCompare);
add("date", validDate);
add("email", validEmail);
add("enum", validEnum);
add("float", validFloat);
add("integer", validInteger);
add("password", validPassword);
add("regex", validRegex);
add("string", validString);
add("time", validTime);

// Export all public functions
module.exports = { add, find, remove, update };
