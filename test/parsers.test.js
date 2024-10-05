// parsers.test.js:

// load all necessary modules
const assert = require("node:assert");
const { describe, it } = require("node:test");
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
} = require("../lib/parsers");

// Setup a test environment
process.env.AUTH_ROLES = "Guest,Subscriber,Admin";
process.env.PASSWORD_MIN_LENGTH = "8";
process.env.PASSWORD_MIN_UPPER = "1";
process.env.PASSWORD_MIN_LOWER = "1";
process.env.PASSWORD_MIN_DIGIT = "1";
process.env.PASSWORD_MIN_SYMBOL = "1";

describe("authRoleParser", () => {
  assert.strictEqual(authRoleParser("Admin"), "Admin");
  assert.strictEqual(authRoleParser("InvalidRole"), null);
});

describe("booleanParser", () => {
  assert.strictEqual(booleanParser(true), true);
  assert.strictEqual(booleanParser(false), false);
  assert.strictEqual(booleanParser("true"), true);
  assert.strictEqual(booleanParser("notabool"), null);
});

describe("dateParser", () => {
  const date = dateParser("2022-10-04T00:00:00Z");
  assert.ok(date instanceof Date);
  assert.strictEqual(date.toISOString(), "2022-10-04T00:00:00.000Z");
  assert.strictEqual(dateParser("invalid date"), null);
});

describe("emailParser", () => {
  assert.strictEqual(emailParser(" TEST@Example.com "), "test@example.com");
  assert.strictEqual(emailParser("invalid-email"), null);
});

describe("enumParser", () => {
  assert.strictEqual(
    enumParser("Admin", ["Guest", "Subscriber", "Admin"]),
    "Admin"
  );
  assert.strictEqual(
    enumParser("Invalid", ["Guest", "Subscriber", "Admin"]),
    null
  );
});

describe("floatParser", () => {
  assert.strictEqual(floatParser("3.14"), 3.14);
  assert.strictEqual(floatParser("invalid"), null);
});

describe("integerParser", () => {
  assert.strictEqual(integerParser("42"), 42);
  assert.strictEqual(integerParser("invalid"), null);
});

describe("passwordParser", () => {
  assert.strictEqual(passwordParser("A1@password"), "A1@password");
  assert.strictEqual(passwordParser("Short1!"), null);
  assert.strictEqual(passwordParser("lowercase1!"), null);
  assert.strictEqual(passwordParser("UPPERCASE1!"), null);
  assert.strictEqual(passwordParser("Uppercase!"), null);
  assert.strictEqual(passwordParser("Uppercase1"), null);
});

describe("stringParser", () => {
  assert.strictEqual(stringParser("Hello, World!"), "Hello, World!");
});

describe("timeParser", () => {
  assert.strictEqual(timeParser("12:30 PM"), "12:30");
  assert.strictEqual(timeParser("invalid time"), null);
  assert.strictEqual(timeParser("1:30:30 PM"), "13:30:30");
});