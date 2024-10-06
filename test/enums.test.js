// enums.test.js:

// load all necessary modules
const assert = require("node:assert");
const { test } = require("node:test");
const { add, find, remove, update } = require("../lib/enums");

test("enums.add", () => {
  // Add a new enum
  add("Colors", ["Red", "Green", "Blue"]);
  assert.deepStrictEqual(find("Colors"), {
    name: "Colors",
    values: ["Red", "Green", "Blue"],
  });

  // Attempt to add the same enum again
  add("Colors", ["Red", "Green", "Blue"]);
  assert.deepStrictEqual(find("Colors"), {
    name: "Colors",
    values: ["Red", "Green", "Blue"],
  });
});

test("enums.find", () => {
  add("Shapes", ["Circle", "Square"]);
  const shapeEnum = find("Shapes");
  assert.deepStrictEqual(shapeEnum, {
    name: "Shapes",
    values: ["Circle", "Square"],
  });

  const missingEnum = find("NonExistent");
  assert.strictEqual(missingEnum, undefined);
});

test("enums.remove", () => {
  add("Fruits", ["Apple", "Banana"]);
  assert.deepStrictEqual(find("Fruits"), {
    name: "Fruits",
    values: ["Apple", "Banana"],
  });

  // Remove the enum
  remove("Fruits");
  assert.strictEqual(find("Fruits"), undefined);

  // Attempt to remove a non-existent enum
  assert.throws(() => remove("NonExistent"), {
    message: '"NonExistent" is not defined',
  });
});

test("enums.update", () => {
  add("Vehicles", ["Car", "Bike"]);
  assert.deepStrictEqual(find("Vehicles"), {
    name: "Vehicles",
    values: ["Car", "Bike"],
  });

  // Update the enum values
  update("Vehicles", ["Truck", "Scooter"]);
  assert.deepStrictEqual(find("Vehicles"), {
    name: "Vehicles",
    values: ["Truck", "Scooter"],
  });

  // Attempt to update a non-existent enum
  assert.throws(() => update("NonExistent", ["Value"]), {
    message: '"NonExistent" is not defined',
  });
});
