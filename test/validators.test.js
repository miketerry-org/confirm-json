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

test("authRoleValidator", () => {
  let errors = [];
  assert.strictEqual(
    authRoleValidator(
      { name: "role", type: "authRole", required: true },
      { role: "admin" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    authRoleValidator(
      { name: "role", type: "authRole", required: true },
      { role: "testor" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    booleanValidator({ name: "active", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    compareValidator(
      { name: "compareAge", required: true, params: ["age"] },
      { age: 20, compareAge: 21 },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    dateValidator({ name: "date", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    emailValidator({ name: "email", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
});

test("enumValidator", () => {
  enums.add("status", ["active", "inactive"]);

  let errors = [];
  assert.strictEqual(
    enumValidator(
      { name: "status", type: "enum", required: true, params: ["status"] },
      { status: "active" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors, []);

  assert.strictEqual(
    enumValidator(
      { name: "status", type: "enum", required: true, params: ["status"] },
      { status: "pending" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    floatValidator({ name: "price", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    integerValidator({ name: "quantity", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
});

test("passwordValidator", () => {
  let errors = [];
  assert.strictEqual(
    passwordValidator(
      { name: "password", required: true },
      { password: "Abcd-1234" },
      errors
    ),
    true
  );
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    passwordValidator(
      { name: "password", required: true },
      { password: "123" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  let regExp = /^(?!hello world).*/;

  assert.strictEqual(
    regexValidator(
      { name: "message", required: true, params: [regExp] },
      { message: "hello world" },
      errors
    ),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
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
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    stringValidator({ name: "name", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
});

test("timeValidator", () => {
  let errors = [];
  assert.strictEqual(
    timeValidator({ name: "time", required: true }, { time: "12:30" }, errors),
    true
  );
  assert.deepStrictEqual(errors.length, 0);

  assert.strictEqual(
    timeValidator({ name: "time", required: true }, {}, errors),
    false
  );
  assert.deepStrictEqual(errors.length, 1);
});
