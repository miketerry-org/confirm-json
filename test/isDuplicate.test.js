// isDuplicate.test.js:

"use strict";

// load all necessary modules
const Confirm = require("../index");

describe(`isDuplicate`, () => {
  describe(`typeof = "boolean"`, () => {
    it(`should be a duplicate`, () => {
      const data = { value1: true, value2: true };
      const confirm = new Confirm(data).isDuplicate("value1", "value2");
      expect(confirm.errors.length).toBe(0);
    });

    it(`should not be a duplicate`, () => {
      const data = { value1: true, value2: false };
      const confirm = new Confirm(data).isDuplicate("value1", "value2");
      expect(confirm.errors.length).toBe(1);
    });
  });

  describe(`typeof = "date"`, () => {
    it(`should be a duplicate`, () => {
      const data = { value1: today(), value2: today() };
      constconfirm = new Confirm(data).isDuplicate("value1", "value2");
      expect(checker.errors.length).toBe(0);
    });

    it(`should not be a duplicate`, () => {
      const data = { value1: today(), value2: tomorrow() };
      const confirm = new Confirm(data).isDuplicate("value1", "value2");
      expect(confirm.errors.length).toBe(1);
    });
  });

  describe(`typeof = "email"`, () => {
    it(`should be a duplicate`, () => {
      const data = {
        value1: "support@example.com",
        value2: "support@example.com",
      };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(0);
    });

    it(`should not be a duplicate`, () => {
      const data = {
        value1: "support@example.com",
        value2: "support@example.net",
      };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(1);
    });
  });

  describe(`typeof = "enum"`, () => {
    it(`should be a duplicate`, () => {
      const data = { role1: "Guest", role2: "Guest" };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(0);
    });

    it(`should not be a duplicate`, () => {
      const data = {};
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(1);
    });
  });

  describe(`typeof = "float"`, () => {
    it(`should be a validduplicate float`, () => {
      const data = { value1: 3.14, value2: 3.14 };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(1);
    });

    it(`should not be a duplicate float`, () => {
      const data = { value1: 123, value2: 123.1 };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(1);
    });
  });

  describe(`typeof = "integer"`, () => {
    it(`should be a duplicate integer`, () => {
      const data = { value1: 123, value2: 123 };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(0);
    });

    it(`should not be a duplicate integer`, () => {
      const data = { value1: 123, value2: 124 };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(1);
    });
  });

  describe(`typeof = "string"`, () => {
    it(`should be a duplicate string`, () => {
      const data = { value1: "hello world", value2: "hello world" };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(0);
    });

    it(`should not be a duplicate string`, () => {
      const data = { value1: "hello world", value2: "goodbye world" };
      expect(
        new Confirm(data).isDuplicate("value1", "value2").errors.length
      ).toEqual(1);
    });
  });
});
