// check_isDate.test.js:

"use strict";

// load all necessary modules
const Check = require("../../lib/utils/check");

describe(`isDate`, () => {
  describe(`typeof = Date object`, () => {
    it(`should be a valid Date object`, () => {
      const dob = new Date("1945-01-23");
      let data = { dob };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.dob).toBe(dob);
    });

    it(`should be an invalid Date object`, () => {
      let data = { dob: new Date("1945-01-32") };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(1);
    });
  });

  describe(`typeof = string`, () => {
    it(`should be valid "mm-dd-yyyy" format`, () => {
      let data = { dob: "01/23/1945" };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(0);
    });

    it(`should be invalid "mm-dd-yyyy" format`, () => {
      let data = { dob: "01/32/1945" };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(1);
    });

    it(`should be valid "yyyy-mm-dd" format`, () => {
      let data = { dob: "1945-01-23" };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(0);
    });

    it(`should be invalid "yyyy-mm-dd" format`, () => {
      let data = { dob: "1945-01-32" };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(1);
    });

    it(`should be invalid "dd-mm-yyyy" format`, () => {
      let data = { dob: "23/01/1945" };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(1);
    });
  });
});
