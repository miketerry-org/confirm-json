!!ERROR, this needs to be rewritten

// check.test.js:

"use strict";

// load all required modules
const Check = require("../../lib/utils/check");

describe("isString", () => {
  describe("capitalization", () => {
    it("should be first letter capital for each word", () => {
      const data = { firstname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", undefined, 1, 20, "title");
      expect(checker.errors.length).toBe(0);
      expect(data.firstname).toBe("Donald Mallard");
    });

    it("should be capital for first word", () => {
      const data = { lastname: "duck" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 20, "first");
      expect(checker.errors.length).toBe(0);
      expect(data.lastname).toBe("Duck");
    });

    it("should be all uppercase letters", () => {
      const data = { lastname: "duck" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 20, "upper");
      expect(checker.errors.length).toBe(0);
      expect(data.lastname).toBe("DUCK");
    });

    it("should be all lower case letters", () => {
      const data = { lastname: "DUCK" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 20, "lower");
      expect(checker.errors.length).toBe(0);
      expect(data.lastname).toBe("duck");
    });
  });

  describe("required", () => {
    it("is required", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", undefined, 1, 10, "title");
      expect(checker.errors.length).toBe(1);
    });

    it("is not required", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", undefined, 1, 10, "title");
      expect(checker.errors.length).toBe(1);
    });
  });

  describe("default value", () => {
    it("should use default", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", "Daisy", 1, 10, "title");
      expect(checker.errors.length).toBe(0);
      expect(data.firstname).toBe("Daisy");
    });
  });

  describe("minLength & maxLength", () => {
    it("should have length of 5 or more", () => {
      const data = { lastname: "DUCK" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 5, 20, "lower");
      expect(checker.errors.length).toBe(1);
    });

    it("should have length of 10 or less", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 10, "title");
      expect(checker.errors.length).toBe(1);
    });
  });
});
