// rules.js: Implements functions to manage JSON validation rules

// Load all needed packages
const types = require("./types.js");

// Array of rules
const _rules = [];

/**
 * Parses a rule defined as a string into a rule object.
 * @param {string} text - The rule string to parse.
 * @returns {Object} - The parsed rule object.
 * @throws {Error} - Throws an error if the rule is invalid.
 */
function parseRule(text) {
  // Use commas to separate the rule into individual parts
  let parts = text.split(",");

  // Verify name was specified
  let name = parts[0].trim().toLowerCase();
  if (name.length === 0) {
    throw new Error(`Name of property is missing`);
  }

  // Ensure the data type was specified
  let type = parts[1].trim().toLowerCase();
  if (type.length === 0) {
    throw new Error(`Type of property is missing`);
  }

  // Ensure the existence was specified
  let exists = parts[2].trim().toLowerCase();
  if (exists === "") {
    throw new Error(`Exists is missing`);
  } else if (exists !== "required" && exists !== "optional") {
    throw new Error(`Exists must be "required" or "optional"`);
  }

  // Set the required boolean flag
  let required = exists === "required";

  // Attempt to get default value
  let defaultValue = parts[3];

  // Use rest of parts as parameters for data type handler
  let params = parts.slice(4).map((part) => part);

  // use type to determine if proper number of parameters returned
  switch (type) {
    case "enum":
      if (!params || params.length < 1) {
        throw new Error(
          `"${name}" is type "${type}" and must specify enumeration type`
        );
        break;
      }
  }

  // Return the rule object
  return { name, type, required, defaultValue, params };
}

/**
 * Parses an array of rule strings into a structured object.
 * @param {string} title - The title of the rules.
 * @param {Array<string>} rules - An array of rule strings to parse.
 * @returns {Object} - An object containing the title and parsed rules.
 * @throws {Error} - Throws an error if rules are invalid or not defined.
 */
function parseRules(title, rules) {
  // Ensure rules are defined and not an empty array
  if (!rules || !Array.isArray(rules) || rules.length < 1) {
    throw new Error(`[${title}] Must define one or more object property rules`);
  }

  // Initialize item object to be added to registry
  let item = {};
  item.title = title.trim().toLowerCase();
  item.rules = [];

  // Loop through parsing each rule and adding it to the item's rule array
  rules.map((rule) => {
    try {
      item.rules.push(parseRule(rule));
    } catch (e) {
      throw new Error(`[${title}] ${e.message}`);
    }
  });

  // Return the item
  return item;
}

/**
 * Finds the specified titled rules in the registry.
 * @param {string} title - The title of the rules to find.
 * @returns {Object|undefined} - Returns the rules object if found, otherwise undefined.
 */
function find(title) {
  title = title.trim().toLowerCase();
  return _rules.find((item) => item.title === title);
}

/**
 * Adds a named array of rules to the registry.
 * @param {string} title - The title of the rules to add.
 * @param {Array<string>} rules - An array of rule strings to add.
 * @returns {Object} - The newly parsed rules object.
 * @throws {Error} - Throws an error if rules with the specified title are already registered.
 */
function add(title, rules) {
  // See if rules with specified title are already registered
  if (find(title) !== undefined) {
    throw new Error(`[${title}] Duplicate definition of rules`);
  }

  // Parse array of rules and append to the global registry
  let item = parseRules(title, rules);
  _rules.push(item);

  // Return the new parsed rules
  return item;
}

/**
 * Middleware function used when data validation is needed.
 * @param {string} title - The title of the rules to use for validation.
 * @returns {Function} - Express middleware function.
 */
const middleware = (title) => (req, res, next) => {
  req.errors = validate(title, req.body);
  next();
};

/**
 * Validates the data using specified rules.
 * @param {string} title - The title of the rules to validate against.
 * @param {Object} data - The data object to validate.
 * @returns {Array<string>} - An array of error messages, if any.
 * @throws {Error} - Throws an error if the specified set of rules is not defined.
 */
function validate(title, data) {
  // Ensure specified set of rules is defined
  let rules = find(title);
  if (rules === undefined) {
    throw new Error(`"${title}" rules not defined`);
  }

  // Define empty array of errors
  let errors = [];

  // Loop through validating each rule
  rules.rules.map((rule) => {
    // Use the validator associated with the type
    types.validate(rule, data, errors);
  });

  // Return array of errors
  return errors;
}

// Export all public functions
module.exports = {
  add,
  find,
  get length() {
    return _rules.length;
  },
  middleware,
  validate,
};
