// rules.test.js:

const { test } = require("node:test");
const assert = require("node:assert");
const { add, find, middleware, validate } = require("../lib/rules.js");

// Test cases for add function
test("rules.add", () => {
  const rulesArray = ["username,string,required"];
  const newRules = add("User Rules", rulesArray);

  assert.strictEqual(newRules.title, "user rules");
  assert.strictEqual(newRules.rules.length, 1);

  assert.throws(() => add("User Rules", rulesArray), {
    message: '"User Rules" Duplicate definition of rules',
  });
});

// Test cases for find function
test("rules.find", () => {
  const rulesArray = ["username,string,required"];
  add("Find Test Rules", rulesArray);

  const found = find("Find Test Rules");
  assert.strictEqual(found.title, "find test rules");

  assert.strictEqual(find("Non Existent Rules"), undefined);
});

test("rules.validate", () => {
  const rulesArray = ["username,string,required"];
  add("Validation Test", rulesArray);

  let errors = validate("Validation Test", { username: "testUser" });
  assert.deepStrictEqual(errors, []);

  errors = validate("Validation Test", {});
  assert.deepStrictEqual(errors, ['"username" is required']);

  assert.throws(() => validate("Undefined Rules", {}), {
    message: '"Undefined Rules" rules not defined',
  });
});

test("rules.middleware", () => {
  const req = { body: {} };
  const res = {};
  const next = () => {};

  // Add rules for testing
  add("Middleware Test", ["username,string,required"]);

  const mw = middleware("Middleware Test");
  mw(req, res, next);

  assert.deepStrictEqual(req.errors, ['"username" is required']);
});
