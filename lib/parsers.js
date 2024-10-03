// parsers.js:

// configuration values used when parsing password
const passwordConfig = {
  minLength: 8,
  minUpper: 1,
  minLower: 1,
  minDigits: 1,
  minSymbols: 1,
};

// use environment variables to overwrite default password configuration
let value = parseInt(process.env.PASSWORD_MIN_Upper);
if (value !== NaN) {
  passwordConfig.minUpper = value;
}
value = parseInt(process.env.PASSWORD_MIN_Lower);
if (value !== NaN) {
  passwordConfig.minLower = value;
}
value = parseInt(process.env.PASSWORD_MIN_Digits);
if (value !== NaN) {
  passwordConfig.minDigits = value;
}
value = parseInt(process.env.PASSWORD_MIN_Symbbols);
if (value !== NaN) {
  passwordConfig.minSymbols = value;
}

// use process environment variable to override default authentication roles
value = process.env.AUTH_ROLES;
if (value === undefined || value === "") {
  value = "Guest,Subscriber,Admin";
}
const authRoles = value.split(",");

/**
 * Parses a given value to determine the corresponding authentication role.
 *
 * @param {string} value - The value to be parsed as an authentication role.
 * @returns {string|null} The corresponding authentication role if found, otherwise null.
 */
function parseAuthRole(value) {
  return parseEnum(value, authRoles);
}

/**
 * Parses a boolean value from various input types.
 *
 * @param {boolean|string|number} value - The value to parse as a boolean.
 * @returns {boolean|NaN} - Returns the boolean value or NaN if the value is invalid.
 */
function parseBoolean(value) {
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
          return NaN;
      }
    case "number":
      if (Number.isInteger(value)) {
        if (value === 1) {
          return true;
        } else if (value === 0) {
          return false;
        }
      }
      return NaN;
    default:
      return NaN;
  }
}

/**
 * Parses a value into a Date object.
 *
 * @param {string} value - The value to parse as a date.
 * @returns {Date|NaN} - Returns a Date object if valid, or NaN if invalid.
 */
function parseDate(value) {
  const timestamp = Date.parse(value);
  return isNaN(timestamp) ? NaN : new Date(timestamp);
}

/**
 * Parses a value into a valid email format.
 *
 * @param {string} value - The value to parse as an email.
 * @returns {string|NaN} - Returns the formatted email or NaN if invalid.
 */
function parseEmail(value) {
  // Trim whitespace and convert to lowercase
  const email = value.trim().toLowerCase();

  // Simple regex for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regex
  if (emailRegex.test(email)) {
    return email; // Return the formatted email
  }

  // Return NaN for invalid email
  return NaN;
}

/**
 * Parses a value into an enumerated type.
 *
 * @param {string} value - The value to parse.
 * @param {Array<string>} enums - The array of valid enum values.
 * @returns {string|NaN} - Returns the matched enum value or NaN if invalid.
 */
function parseEnum(value, enums) {
  // Check if value is a string
  if (typeof value !== "string") {
    return NaN;
  }

  // Normalize the value to lower case
  const normalizedValue = value.toLowerCase();

  // Loop through the enums array
  for (const enumValue of enums) {
    if (enumValue.toLowerCase() === normalizedValue) {
      // Return the matched enum with its original case
      return enumValue;
    }
  }

  // Return NaN if no match is found
  return NaN;
}

/**
 * Parses a value to validate a password based on specific criteria.
 *
 * @param {string} value - The password to validate.
 * @returns {string|NaN} - Returns the valid password or NaN if invalid.
 */
function parsePassword(value) {
  // Check if the value is a string
  if (typeof value !== "string") {
    return NaN;
  }

  // Check password length
  if (value.length < passwordConfig.minLength) {
    return NaN;
  }

  // Initialize counters
  let upperCount = 0;
  let lowerCount = 0;
  let digitCount = 0;
  let symbolCount = 0;

  // Define symbols based on keyboard characters
  const symbols = `!@#$%^&*()_+-=[]{};':"\\|,.<>?/~``;`;

  // Check each character in the password
  for (const char of value) {
    if (/[A-Z]/.test(char)) {
      upperCount++;
    } else if (/[a-z]/.test(char)) {
      lowerCount++;
    } else if (/\d/.test(char)) {
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
    return NaN;
  }

  // Return the valid password
  return value;
}

/**
 * Parses a time string and returns it in 24-hour format.
 *
 * @param {string} timeString - The time string to parse.
 * @returns {string|NaN} - Returns the formatted time or NaN if invalid.
 */
function parseTime(timeString) {
  // Match the time string with optional seconds and AM/PM
  const timeParts = timeString.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))? ?([AP]M)?$/i
  );

  if (!timeParts) {
    return NaN; // Return NaN for invalid format
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
    return NaN; // Return NaN for invalid time
  }

  // Format as HH:mm or HH:mm:ss
  return seconds > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

//export all parse functions
module.exports = {
  parseAuthRole,
  parseBoolean,
  parseDate,
  parseEmail,
  parseEnum,
  parsePassword,
  parseTime,
};
