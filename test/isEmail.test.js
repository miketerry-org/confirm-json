// isEmail.test.js:

"use strict";

// load all necessary modules
const Confirm = require("../index");

describe(`isEmail`, () => {
  describe(`typeof = "string"`, () => {
    it(`should be a valid email`, () => {
      const data = { email: "donald_duck@disney.com" };
      expect(new Confirm(data).isEmail("email").errors.length).toEqual(0);
    });

    it(`should not be a valid email`, () => {
        const data = { email: "donald_duck-disney.com" };
        expect(new Confirm(data).isEmail("email").errors.length).toEqual(1);
    });
});
