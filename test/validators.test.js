// validators.test.js:

// load all necessary modules
const test = require("node:test");
const assert = require("node:assert");
const validators = require("../lib/validators");

const _data = {
  firstname: "Sherlock",
  lastname: "Holms",
  active: true,
  email: "sherlock.holmes@email.com",
  confirmEmail: "sherlock.holmes@email.com",
  password: "abcd-1234",
  confirmPassword: "abcd-1234",
};

const _rule = {
  name: "active",
  type: "boolean",
  required: true,
  defaultValue: false,
  params: [],
};

function validBoolean(rule, data) {
  // determine if the data object includes the specified property
  let exists = Object.keys(data).includes(rule.name);

  // if data object has specified named property
  if (exists) {
    // get the data value
    let value = data[rule.name];

    // ensure type of data value matches rule
    let type = typeof value;
    if (type !== rule.type) {
      throw new Error(
        `Expected "${rule.name}" to be type "${rule.type}" and not "${type}"`
      );
    }
  }
}

let result = validBoolean(_rule, _data);
console.log(`result: ${result}`);
