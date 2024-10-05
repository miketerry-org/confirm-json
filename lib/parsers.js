// parsers.js

// Configuration values used when parsing password
const passwordConfig = {
  minLength: parseEnvInt("PASSWORD_MIN_LENGTH", 8),
  minUpper: parseEnvInt("PASSWORD_MIN_UPPER", 1),
  minLower: parseEnvInt("PASSWORD_MIN_LOWER", 1),
  minDigits: parseEnvInt("PASSWORD_MIN_DIGIT", 1),
  minSymbols: parseEnvInt("PASSWORD_MIN_SYMBOL", 1),
};

// Use process environment variable to override default authentication roles value
let value = process.env.AUTH_ROLES;
if (!value || value === "") {
  value = "Guest,Subscriber,Admin";
}
const authRoles = value.split(",");

/**
 * Parses a specified environment variable as an integer.
 *
 * @param {string} name - The name of the environment variable.
 * @param {number} defaultValue - The default value if the environment variable is not defined or invalid.
 * @returns {number} The parsed integer value.
 */
function parseEnvInt(name, defaultValue) {
  let value = parseInt(process.env[name]);
  if (Number.isNaN(value)) {
    value = defaultValue;
  }
  return value;
}

/**
 * Parses a given value to determine the corresponding authentication role.
 *
 * @param {string} value - The value to be parsed as an authentication role.
 * @returns {string|null} The corresponding authentication role if found, otherwise null.
 */
function authRoleParser(value) {
  return enumParser(value, authRoles);
}

/**
 * Parses a boolean value from various input types.
 *
 * @param {boolean|string|number} value - The value to parse as a boolean.
 * @returns {boolean|null} The parsed boolean value, or null if the value is invalid.
 */
function booleanParser(value) {
  let type = typeof value;
  switch (type) {
    case "boolean":
      return value;
    case "string":
      value = value.toLowerCase();
      switch (value) {
        case "true":
        case "t":
          return true;
        case "false":
        case "f":
          return false;
        default:
          return null;
      }
    case "number":
      if (Number.isInteger(value)) {
        return value === 1; // true
      }
      return null;
    default:
      return null;
  }
}

/**
 * Parses a value into a Date object.
 *
 * @param {string} value - The value to parse as a date.
 * @returns {Date|null} The parsed Date object, or null if the value is invalid.
 */
function dateParser(value) {
  const timestamp = Date.parse(value);
  return isNaN(timestamp) ? null : new Date(timestamp);
}

/**
 * Parses a value into a valid email format.
 *
 * @param {string} value - The value to parse as an email.
 * @returns {string|null} The formatted email if valid, otherwise null.
 */
function emailParser(value) {
  // Trim whitespace and convert to lowercase
  const email = value.trim().toLowerCase();

  // Simple regex for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regex
  if (emailRegex.test(email)) {
    // Return the formatted email
    return email;
  }

  // Return null for invalid email
  return null;
}

/**
 * Parses a value into an enumerated type.
 *
 * @param {string} value - The value to parse.
 * @param {Array<string>} enums - The array of valid enum values.
 * @returns {string|null} The matched enum value if valid, otherwise null.
 */
function enumParser(value, enums) {
  // Check if value is a string
  if (typeof value !== "string") {
    return null;
  }

  // Normalize the value to lower case
  const normalizedValue = value.trim().toLowerCase();

  // Loop through the enums array
  for (const enumValue of enums) {
    if (enumValue.toLowerCase() === normalizedValue) {
      // Return the matched enum with its original case
      return enumValue;
    }
  }

  // Return null if no match is found
  return null;
}

/**
 * Parses a value into a float.
 *
 * @param {string|number} value - The value to parse as a float.
 * @returns {number|null} The parsed float value if valid, otherwise null.
 */
function floatParser(value) {
  value = parseFloat(value);
  return Number.isNaN(value) ? null : value;
}

/**
 * Parses a value into an integer.
 *
 * @param {string|number} value - The value to parse as an integer.
 * @returns {number|null} The parsed integer value if valid, otherwise null.
 */
function integerParser(value) {
  value = parseInt(value);
  return Number.isNaN(value) ? null : value;
}

/**
 * Parses a value to validate a password based on specific criteria.
 *
 * @param {string} value - The password to validate.
 * @returns {string|null} The valid password if valid, otherwise null.
 */
function passwordParser(value) {
  // Check if the value is a string
  if (typeof value !== "string") {
    return null;
  }

  // Check password length
  if (value.length < passwordConfig.minLength) {
    return null;
  }

  // Initialize counters
  let upperCount = 0;
  let lowerCount = 0;
  let digitCount = 0;
  let symbolCount = 0;

  // Define symbols based on keyboard characters
  const symbols = `!@#$%^&*()_+-=[]{};':"\\|,.<>?/~;`;

  // Check each character in the password
  for (const char of value) {
    if (char >= "A" && char <= "Z") {
      upperCount++;
    } else if (char >= "a" && char <= "z") {
      lowerCount++;
    } else if (char >= "0" && char <= "9") {
      digitCount++;
    } else if (symbols.includes(char)) {
      symbolCount++;
    }
  }

  // Validate counts against configuration
  if (
    upperCount < passwordConfig.minUpper ||
    lowerCount < passwordConfig.minLower ||
    digitCount < passwordConfig.minDigits ||
    symbolCount < passwordConfig.minSymbols
  ) {
    return null;
  }

  // Return the valid password
  return value;
}

/**
 * Parses a string value.
 *
 * @param {string} value - The value to parse as a string.
 * @returns {string} The parsed string value.
 */
function stringParser(value) {
  return value;
}

/**
 * Parses a time string and returns it in 24-hour format.
 *
 * @param {string} value - The time string to parse.
 * @returns {string|null} The formatted time if valid, otherwise null.
 */
function timeParser(value) {
  // Match the time string with optional seconds and AM/PM
  const timeParts = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))? ?([AP]M)?$/i);

  if (!timeParts) {
    // Return null for invalid format
    return null;
  }

  let hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);
  const seconds = timeParts[3] ? parseInt(timeParts[3], 10) : 0;
  const period = timeParts[4];

  // Adjust hours for AM/PM
  if (period) {
    if (period.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }
    if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
  }

  // Validate time
  if (
    hours < 0 ||
    hours >= 24 ||
    minutes < 0 ||
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60
  ) {
    // Return null for invalid time
    return null;
  }

  // Format as HH:mm or HH:mm:ss
  return seconds > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// Export all parse functions
module.exports = {
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
};
