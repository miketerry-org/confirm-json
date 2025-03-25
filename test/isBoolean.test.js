!!ERROR, this needs to be rewritten

// check_isBoolean.test.js:

"use strict";

// load all required modules
const Check = require("../../lib/utils/check");
const logger = require("../test-logger");

console.log("hello world");
logger.info("hello world");

describe("isBoolean", () => {
  describe('typeof = "boolean"', () => {
    it("should be type boolean and be true", () => {
      let data = { active: true };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
      logger.info("should be type boolean and be true", true);
    });

    it("should be boolean type and be false", () => {
      let data = { active: false };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });
  });

  describe(`typeof = "string"`, () => {
    it(`should be string "true" and converted to boolean true`, () => {
      let data = { active: "true" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "false" and converted to boolean false`, () => {
      let data = { active: "false" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });

    it(`should be string "T" and converted to boolean true`, () => {
      let data = { active: "T" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "F" and converted to boolean false`, () => {
      let data = { active: "F" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });

    it(`should be string "YES" and converted to boolean true`, () => {
      let data = { active: "YES" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "NO" and converted to boolean false`, () => {
      let data = { active: "NO" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });

    it(`should be string "y" and converted to boolean true`, () => {
      let data = { active: "y" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "n" and converted to boolean false`, () => {
      let data = { active: "n" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });

    it(`should be string "On" and converted to boolean true`, () => {
      let data = { active: "On" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "Off" and converted to boolean false`, () => {
      let data = { active: "Off" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });
  });

  describe(`typeof = "number"`, () => {
    it(`should be number 1 and converted to boolean true`, () => {
      let data = { active: 1 };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be number 0 and converted to boolean false`, () => {
      let data = { active: 0 };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });
  });

  describe("typeof is unsupported type", () => {
    it("is date which is invalid boolean", () => {
      let data = { active: new Date() };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(1);
    });

    it("is float which is invalid boolean", () => {
      let data = { active: 3.14 };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(1);
    });

    it("is object which is invalid boolean", () => {
      let data = { active: { value: true } };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(1);
    });

    it("is array which is invalid boolean", () => {
      let data = { active: [1, 2, 3] };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(1);
    });
  });
});
