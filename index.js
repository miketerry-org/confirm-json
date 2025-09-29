// index.js: cconfirm-json

"use strict";

// load all necessary modules
const MoreDate = require("moreDate");
const {
  config: defaultPasswordConfig,
  countCharacters,
} = require("./lib/passwords");
const { titleCase, firstCase } = require("./lib/strings");

/**
 * Class to confirm/validate various data types and values in a JSON object.
 * Supports chainable validation methods, type coercion, normalization, and error collection.
 */
class Confirm {
  /** @type {Object.<string, any>} */
  #data = [];

  /** @type {string[]} */
  #errors = [];

  /**
   * Creates a Confirm instance for the given data object.
   * The data object may be mutated (e.g. default values, normalized values).
   *
   * @param {Object.<string, any>} data - An object whose fields will be validated.
   */
  constructor(data) {
    this.#data = data;
  }

  /**
   * Validate that the field is an array and within optional bounds.
   *
   * @param {string} name - The property name in the data object.
   * @param {any} [defaultValue] - If field is missing or undefined, this default is used.
   * @param {number} [minItems=1] - Minimum number of elements in the array.
   * @param {number} [maxItems=255] - Maximum number of elements.
   * @param {boolean} [required=true] - Whether the field is required.
   * @returns {Confirm} - Returns this instance for chaining.
   */
  isArray(name, defaultValue, minItems = 1, maxItems = 255, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && Array.isArray(value)) {
      const length = value.length;
      if (minItems && length < minItems) {
        this.#errors.push(`"${name}" must have at least ${minItems} items`);
      }
      if (maxItems && length > maxItems) {
        this.#errors.push(`"${name}" must have no more than ${maxItems} items`);
      }
      this.#data[name] = value;
    } else if (value !== undefined) {
      this.#errors.push(`"${name}" is "${value}" which is not a valid array`);
    }

    return this;
  }

  /**
   * Validate or coerce a field to boolean.
   * Accepts boolean, numeric (1 or 0), or string values ("true", "yes", "no", etc.).
   *
   * @param {string} name - Property name to validate.
   * @param {boolean} [defaultValue] - Default boolean value if the field is missing.
   * @param {boolean} [required=true] - Whether the field must exist.
   * @returns {Confirm}
   */
  isBoolean(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value === undefined) {
      return this;
    }

    const type = typeof value;
    if (type === "string") {
      const trueValues = [true, "true", "t", "yes", "y", "on"];
      const falseValues = [false, "false", "f", "no", "n", "off"];
      let lower = value.toLowerCase();

      if (trueValues.includes(lower)) {
        this.#data[name] = true;
      } else if (falseValues.includes(lower)) {
        this.#data[name] = false;
      } else {
        this.#errors.push(
          `"${name}" is "${value}" which is not a valid boolean value`
        );
      }
    } else if (type === "number") {
      if (value === 1) {
        this.#data[name] = true;
      } else if (value === 0) {
        this.#data[name] = false;
      } else {
        this.#errors.push(
          `"${name}" is "${value}" which is not a valid boolean value`
        );
      }
    } else if (type !== "boolean") {
      this.#errors.push(
        `"${name}" is "${value}" which is not a valid boolean value`
      );
    }

    return this;
  }

  /**
   * Validate or coerce a field to a Date instance.
   * Uses MoreDate.parseDate and MoreDate.isDate internally.
   *
   * @param {string} name - Property name.
   * @param {Date|string} [defaultValue] - Default value if missing.
   * @param {boolean} [required=true] - Whether the field is required.
   * @returns {Confirm}
   */
  isDate(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value === undefined) {
      return this;
    }

    value = MoreDate.parseDate(value);
    if (MoreDate.isDate(value)) {
      this.#data[name] = value;
    } else {
      this.#errors.push(`"${name}" is not a valid date`);
    }

    return this;
  }

  /**
   * Ensure that two fields in the object match (equal values or equal dates).
   *
   * @param {string} name - First field name.
   * @param {string} duplicateName - Second field name to compare.
   * @param {boolean} [required=true] - Whether both fields must exist.
   * @returns {Confirm}
   */
  isDuplicate(name, duplicateName, required = true) {
    let value1 = this._getValue(name, undefined, required);
    let value2 = this._getValue(duplicateName, undefined, required);

    if (value1 == null || value2 == null) {
      this.#errors.push(
        `Both "${name}" and "${duplicateName}" values are required`
      );
      return this;
    }

    if (value1 instanceof Date && value2 instanceof Date) {
      if (!MoreDate.sameDate(value1, value2)) {
        this.#errors.push(`"${name}" and "${duplicateName}" do not match`);
      }
      return this;
    }

    if (typeof value1 !== typeof value2) {
      this.#errors.push(`"${name}" and "${duplicateName}" do not match`);
      return this;
    }

    if (value1 !== value2) {
      this.#errors.push(`"${name}" and "${duplicateName}" do not match`);
    }

    return this;
  }

  /**
   * Validate that the field is a valid email string.
   *
   * @param {string} name - Field name.
   * @param {string} [defaultValue] - Default value if missing.
   * @param {boolean} [required=true] - Whether the field is required.
   * @returns {Confirm}
   */
  isEmail(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._confirmType(name, value, "string")) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(value)) {
        this.#errors.push(`"${name}" is not a valid email`);
      }
    }

    return this;
  }

  /**
   * Validate that the field equals one of the allowed enumeration values.
   * Case-insensitive comparison is used.
   *
   * @param {string} name - Field name.
   * @param {string} [defaultValue] - Default value if missing.
   * @param {string[]} values - Array of allowed string values.
   * @param {boolean} [required=true] - Whether the field must exist.
   * @returns {Confirm}
   */
  isEnum(name, defaultValue, values, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._confirmType(name, value, "string")) {
      const found = values.find(
        item => item.toLowerCase() === value.toLowerCase()
      );
      if (!found) {
        this.#errors.push(`"${name}" is "${value}" which is not a valid value`);
      }
    }

    return this;
  }

  /**
   * Validate or coerce the field to a floating-point number within optional bounds.
   *
   * @param {string} name - Field name.
   * @param {string|number} [defaultValue] - Default if missing.
   * @param {number} [minFloat] - Minimum allowed float value.
   * @param {number} [maxFloat] - Maximum allowed float value.
   * @param {boolean} [required=true] - Whether field must exist.
   * @returns {Confirm}
   */
  isFloat(name, defaultValue, minFloat, maxFloat, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && typeof value === "string") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        value = parsed;
        this.#data[name] = value;
      } else {
        this.#errors.push(
          `"${name}" is "${value}" which is not a valid number`
        );
        return this;
      }
    }

    if (value && this._confirmType(name, value, "number")) {
      if (minFloat != null && value < minFloat) {
        this.#errors.push(`"${name}" cannot be less than "${minFloat}"`);
      } else if (maxFloat != null && value > maxFloat) {
        this.#errors.push(`"${name}" cannot be greater than "${maxFloat}"`);
      }
    }

    return this;
  }

  /**
   * Validate or coerce the field to an integer within optional bounds.
   *
   * @param {string} name - Field name.
   * @param {string|number} [defaultValue] - Default if missing.
   * @param {number} [minInteger] - Minimum allowed integer value.
   * @param {number} [maxInteger] - Maximum allowed integer value.
   * @param {boolean} [required=true] - Whether field must exist.
   * @returns {Confirm}
   */
  isInteger(name, defaultValue, minInteger, maxInteger, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && typeof value === "string") {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        value = parsed;
        this.#data[name] = value;
      } else {
        this.#errors.push(
          `"${name}" is "${value}" which is not a valid number`
        );
        return this;
      }
    }

    if (value && this._confirmType(name, value, "number")) {
      if (minInteger != null && value < minInteger) {
        this.#errors.push(`"${name}" cannot be less than "${minInteger}"`);
      } else if (maxInteger != null && value > maxInteger) {
        this.#errors.push(`"${name}" cannot be greater than "${maxInteger}"`);
      }
    }

    return this;
  }

  /**
   * Validate a password field based on the provided or default configuration.
   *
   * @param {string} name - Field name containing the password.
   * @param {Object} [config={}] - Partial configuration overriding defaults.
   * @param {boolean} [required=true] - Whether the password field is required.
   * @returns {Confirm}
   */
  isPassword(name, config = {}, required = true) {
    let value = this._getValue(name, undefined, required);
    let ok = false;

    if (value && this._confirmType(name, value, "string")) {
      const merged = { ...defaultPasswordConfig, ...config };
      const counts = countCharacters(value);

      ok =
        value.length >= merged.minLength &&
        value.length <= merged.maxLength &&
        counts.upper >= merged.minUpper &&
        counts.lower >= merged.minLower &&
        counts.digits >= merged.minDigits &&
        counts.symbols >= merged.minSymbols;
    }

    if (!ok) {
      this.#errors.push(`"${name}" is not a valid password value`);
    }

    return this;
  }

  /**
   * Validate that a string field matches a given regular expression.
   *
   * @param {string} name - Field name.
   * @param {string} [defaultValue] - Default if missing.
   * @param {RegExp} regEx - The regular expression to test against.
   * @param {boolean} [required=true] - Whether the field is required.
   * @returns {Confirm}
   */
  isRegEx(name, defaultValue, regEx, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._confirmType(name, value, "string")) {
      if (!regEx.test(value)) {
        this.#errors.push(`"${name}" is "${value}" which is not a valid value`);
      }
    }

    return this;
  }

  /**
   * Placeholder for time-based validation (not implemented).
   *
   * @param {string} name
   * @param {any} defaultValue
   * @param {any} minTime
   * @param {any} maxTime
   * @param {boolean} required
   * @returns {Confirm}
   */
  isTime(
    name,
    defaultValue,
    minTime = undefined,
    maxTime = undefined,
    required = true
  ) {
    this.#errors.push(`"isTime" is not implemented! (${name})`);
    return this;
  }

  /**
   * Get all validation error messages.
   *
   * @returns {string[]} - Array of error messages. Empty if none.
   */
  get errors() {
    return this.#errors;
  }

  /**
   * Confirm that a field is of the expected JS type.
   *
   * @private
   * @param {string} name - Field name.
   * @param {any} value - Value to check.
   * @param {string} expectedType - Expected `typeof` result.
   * @returns {boolean} - True if type matches; false (and pushes an error) otherwise.
   */
  _confirmType(name, value, expectedType) {
    const actual = typeof value;
    const same = actual === expectedType;
    if (!same) {
      this.#errors.push(
        `"${name}" is of type "${actual}" but should be of type "${expectedType}"`
      );
    }
    return same;
  }

  /**
   * Get the value for a property, apply a default if undefined, and enforce requiredness.
   *
   * @private
   * @param {string} name - Field name.
   * @param {any} defaultValue - Default to set and return if missing.
   * @param {boolean} required - Whether the field must be present.
   * @returns {any} - The resolved value (could be undefined).
   */
  _getValue(name, defaultValue, required) {
    let value = this.#data[name];

    if (value === undefined) {
      if (defaultValue !== undefined) {
        this.#data[name] = defaultValue;
        value = defaultValue;
      } else if (required) {
        this.#errors.push(`"${name}" field is required.`);
      }
    }

    return value;
  }
}

// export the Confirm class
module.exports = Confirm;
