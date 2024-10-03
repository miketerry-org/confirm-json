// ruleSets.test.js:

// load all necessary modules
const test = require("node:test");
const assert = require("node:assert");
const rules = require("../lib/rules.js");

const userRegister = {
  firstname: "Sherlock",
  lastname: "Holms",
  active: true,
  email: "sherlock.holmes@email.com",
  confirmEmail: "sherlock.holmes@email.com",
  password: "abcd-1234",
  confirmPassword: "abcd-1234",
};

test("valid rules.add", () => {
  rules.add("firstnameRules", [`firstname,string,required,,1,20`]);
});

test("duplicate rules.add", () => {
  assert.throws(() => {
    rules.add("firstnameRules", [`firstname,string,required,,1,20`]);
  });
});

test("add userRegister rules", () => {
  rules.add("userRegister", [
    `firstname,string,required,,1,20`,
    `lastname,string,required,,1,20`,
    `email,email,required,,1, 100`,
    `compareEmail,compare,required,email`,
    `password,password,required,,8,60`,
    `confirmPassword,compare,required,password`,
  ]);
});

test("validate userRegister data", () => {
  let errors = rules.validate("userRegister", userRegister);
  assert(errors.length === 0);
});
