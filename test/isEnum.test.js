// isEnum.test.js:

"use strict";

// load all necessary modules
const Confirm = require("../index");

// define array of enumeration values
const colors = ["red", "green", "blue"];

describe(`isEmail`, () => {
  describe(`typeof = "string"`, () => {
    it(`should be a valid enum`, () => {
      const data = { color: "green" };
      expect(
        new Confirm(data).isEnum("color", "red", colors).errors.length
      ).toEqual(0);
    });

    it(`should not be a valid enum`, () => {
      const data = { color: "white" };
      expect(
        new Confirm(data).isEnum("color", "red", colors).errors.length
      ).toEqual(0);
    });
  });
});
