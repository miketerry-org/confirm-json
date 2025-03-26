// strings.js:

"use strict";

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

// export all functions
module.exports = { titleCase, firstCase };
