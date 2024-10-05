// validators.test.js:

// load all necessary modules
const { test, expect } = require("node:test");
const assert = require("node:assert");
const enums = require("../lib/enums.js");
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
} = require("../lib/validators.js");

// Mock parsers for testing
const mockParsers = {
  authRoleParser: (value) => (value === "admin" ? "admin" : null),
  booleanParser: (value) =>
    value === "true" ? true : value === "false" ? false : null,
  dateParser: (value) => (isNaN(Date.parse(value)) ? null : new Date(value)),
  emailParser: (value) => (/\S+@\S+\.\S+/.test(value) ? value : null),
  floatParser: (value) => (isNaN(parseFloat(value)) ? null : parseFloat(value)),
  integerParser: (value) =>
    isNaN(parseInt(value, 10)) ? null : parseInt(value, 10),
  passwordParser: (value) => (value.length >= 6 ? value : null),
  stringParser: (value) => (typeof value === "string" ? value : null),
  timeParser: (value) => (/\d{2}:\d{2}/.test(value) ? value : null),
};

// Assign mock parsers to validators for testing
const {
  authRoleParser,
  booleanParser,
  dateParser,
  emailParser,
  floatParser,
  integerParser,
  passwordParser,
  stringParser,
  timeParser,
} = mockParsers;

test("authRoleValidator", () => {
  let errors = [];
  assert.strictEqual(
    authRoleValidator(
      { name: "role", required: true },
      { role: "admin" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    authRoleValidator({ name: "role", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"role" is required']);
});

test("booleanValidator", () => {
  let errors = [];
  assert.strictEqual(
    booleanValidator(
      { name: "active", required: true },
      { active: "true" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    booleanValidator({ name: "active", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"active" is required']);
});

test("compareValidator", () => {
  let errors = [];
  assert.strictEqual(
    compareValidator(
      { name: "compareAge", required: true, params: ["age"] },
      { age: 20, compareAge: 20 },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);

  assert.strictEqual(
    compareValidator(
      { name: "compareAge", required: true, params: ["age"] },
      { age: 20, compareAge: 21 },
      errors
    ),
    false
  );
});

test("dateValidator", () => {
  let errors = [];
  assert.strictEqual(
    dateValidator(
      { name: "date", required: true },
      { date: "2023-10-04" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    dateValidator({ name: "date", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"date" is required']);
});

test("emailValidator", () => {
  let errors = [];
  assert.strictEqual(
    emailValidator(
      { name: "email", required: true },
      { email: "test@example.com" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    emailValidator({ name: "email", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"email" is required']);
});

test("enumValidator", () => {
  enums.add("status", ["active", "inactive"]);

  let errors = [];
  assert.strictEqual(
    enumValidator(
      { name: "status", type: "status", required: true },
      { status: "active" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);

  assert.strictEqual(
    enumValidator(
      {
        name: "status",
        type: "status",
        required: true,
      },
      { status: "pending" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors, [
    '"status" must be one of "active", "inactive"',
  ]);
});

test("floatValidator", () => {
  let errors = [];
  assert.strictEqual(
    floatValidator(
      { name: "price", required: true },
      { price: "10.5" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    floatValidator({ name: "price", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"price" is required']);
});

test("integerValidator", () => {
  let errors = [];
  assert.strictEqual(
    integerValidator(
      { name: "quantity", required: true },
      { quantity: "5" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    integerValidator({ name: "quantity", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"quantity" is required']);
});

test("passwordValidator", () => {
  let errors = [];
  assert.strictEqual(
    passwordValidator(
      { name: "password", required: true },
      { password: "123456" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    passwordValidator(
      { name: "password", required: true },
      { password: "123" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors, ['"password" is not a valid "string"']);
});

test("regexValidator", () => {
  let errors = [];
  assert.strictEqual(
    regexValidator(
      { name: "username", required: true, params: ["^[a-zA-Z0-9_]{3,15}$"] },
      { username: "valid_user123" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);

  assert.strictEqual(
    regexValidator(
      { name: "username", required: true, params: ["^[a-zA-Z0-9_]{3,15}$"] },
      { username: "invalid user!" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors, [
    '"username" does not match the required pattern',
  ]);
});

test("stringValidator", () => {
  let errors = [];
  assert.strictEqual(
    stringValidator(
      { name: "name", required: true },
      { name: "John Doe" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    stringValidator({ name: "name", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"name" is required']);
});

test("timeValidator", () => {
  let errors = [];
  assert.strictEqual(
    timeValidator({ name: "time", required: true }, { time: "12:30" }, errors),
    true
  );
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(
    timeValidator({ name: "time", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors, ['"time" is required']);
});
