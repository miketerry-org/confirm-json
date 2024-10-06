// types.test.js:

const { test, expect } = require("node:test");
const assert = require("node:assert");
const types = require("../lib/types.js");

// Mock validators for testing
function mockValidator(rule, data, errors) {
  return true;
}

test("types.add", () => {
  let initialLength = types.length;
  types.add("mockType", mockValidator);
  assert.strictEqual(types.length, initialLength + 1);
  assert.strictEqual(types.find("mockType").validator, mockValidator);

  assert.throws(() => types.add("mockType", mockValidator), {
    message: '"mockType" is already defined',
  });
});

test("types.find", () => {
  const handler = types.find("mockType");
  assert.strictEqual(handler.type, "mockType");
  assert.strictEqual(handler.validator, mockValidator);

  assert.strictEqual(types.find("nonExistentType"), undefined);
});

test("types.remove", () => {
  const initialLength = types.length;
  types.remove("mockType");
  assert.strictEqual(types.length, initialLength - 1);
  assert.strictEqual(types.find("mockType"), undefined);
});

test("types.update", () => {
  types.add("mockType", mockValidator);

  const newValidator = (rule, data, errors) => {
    return data[rule.name] === "updated";
  };

  types.update("mockType", newValidator);
  assert.strictEqual(types.find("mockType").validator, newValidator);

  assert.throws(() => types.update("nonExistentType", mockValidator), {
    message: '"nonExistentType" is not defined',
  });
});

test("types.validate", () => {
  let errors = [];
  let rule = { name: "testField", type: "mockType", required: true };

  // update the mock validator to the type handler
  types.update("mockType", mockValidator);

  assert.strictEqual(
    types.validate(rule, { testField: "value" }, errors),
    true
  );
  assert.deepStrictEqual(errors, []);

  errors = [];
  rule = { name: "testField", type: "nonExistentType", required: true };

  assert.throws(() => types.validate(rule, {}, errors), {
    message: "type is not defined",
  });
});
