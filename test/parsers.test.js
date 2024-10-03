// parsers.test.js:

// load all necessary packages
const { test, expect } = require("node:test");
const assert = require("node:assert");
const {
  parseAuthRole,
  parseBoolean,
  parseDate,
  parseEmail,
  parseEnum,
  parsePassword,
  parseTime,
} = require("../lib/parsers");

test("parseAuthRole", () => {
  assert.strictEqual(parseAuthRole("Admin"), "Admin");
  assert.strictEqual(parseAuthRole("guest"), "Guest");
  assert.strictEqual(parseAuthRole("subscriber"), "Subscriber");
  assert.strictEqual(parseAuthRole("InvalidRole"), NaN);
  assert.strictEqual(parseAuthRole(123), NaN); // non-string input
});

test("parseBoolean", () => {
  assert.strictEqual(parseBoolean(true), true);
  assert.strictEqual(parseBoolean(false), false);
  assert.strictEqual(parseBoolean("true"), true);
  assert.strictEqual(parseBoolean("false"), false);
  assert.strictEqual(parseBoolean("t"), true);
  assert.strictEqual(parseBoolean("f"), false);
  assert.strictEqual(parseBoolean(1), true);
  assert.strictEqual(parseBoolean(0), false);
  assert.strictEqual(parseBoolean("invalid"), NaN);
  assert.strictEqual(parseBoolean(null), NaN);
});

test("parseDate", () => {
  assert.strictEqual(
    parseDate("2021-10-01").toISOString(),
    "2021-10-01T00:00:00.000Z"
  );
  assert.strictEqual(parseDate("invalid-date"), NaN);
  assert.strictEqual(
    parseDate("2021-10-01T10:20:30Z").toISOString(),
    "2021-10-01T10:20:30.000Z"
  );
});

test("parseEmail", () => {
  assert.strictEqual(parseEmail("Test@Example.com"), "test@example.com");
  assert.strictEqual(parseEmail("invalid-email"), NaN);
  assert.strictEqual(parseEmail("  user@domain.com "), "user@domain.com");
});

test("parseEnum", () => {
  assert.strictEqual(parseEnum("Admin", ["Admin", "User", "Guest"]), "Admin");
  assert.strictEqual(parseEnum("guest", ["Admin", "User", "Guest"]), "Guest");
  assert.strictEqual(parseEnum("Invalid", ["Admin", "User", "Guest"]), NaN);
  assert.strictEqual(parseEnum(123, ["Admin", "User", "Guest"]), NaN); // non-string input
});

test("parsePassword", () => {
  // Set environment variable for testing
  process.env.PASSWORD_MIN_Upper = "1";
  process.env.PASSWORD_MIN_Lower = "1";
  process.env.PASSWORD_MIN_Digits = "1";
  process.env.PASSWORD_MIN_Symbbols = "1";

  assert.strictEqual(parsePassword("Password1!"), "Password1!");
  assert.strictEqual(parsePassword("password"), NaN);
  assert.strictEqual(parsePassword("PASSWORD1!"), NaN);
  assert.strictEqual(parsePassword("Pass1!"), NaN);
  assert.strictEqual(parsePassword("Pass1"), NaN);
});

test("parseTime", () => {
  assert.strictEqual(parseTime("12:30 PM"), "12:30");
  assert.strictEqual(parseTime("12:30 AM"), "00:30");
  assert.strictEqual(parseTime("01:30:30 PM"), "13:30:30");
  assert.strictEqual(parseTime("InvalidTime"), NaN);
  assert.strictEqual(parseTime("25:00"), NaN); // Invalid hour
  assert.strictEqual(parseTime("12:60"), NaN); // Invalid minute
});
