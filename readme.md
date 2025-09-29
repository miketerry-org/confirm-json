# confirm-json

A lightweight JSON validation and normalization library.  
Validates fields of a JavaScript object using a chainable API, with support for common types: strings, integers, floats, booleans, arrays, enums, email, passwords, duplicates, regex, dates, etc.

---

## Features

- Chainable API (each validation method returns the Confirm instance)
- Type coercion (e.g. parse string `"123"` to number, `"yes"` → `true`, etc.)
- Normalization (e.g. enforce capitalization styles: upper, lower, title, first)
- Default values support
- Comprehensive error collection
- Minimal dependencies

---

## Installation

```bash
npm install confirm-json

## example

const Confirm = require("confirm-json");

const payload = {
  name: "Jane Doe",
  email: "jane.doe@domain.com",
  birthYear: "1990",
  score: "75.5",
  tags: ["member", "active"],
  active: "t",
  startDate: "2025-01-15",
  secret: "AbcdE1$",
  secretConfirm: "AbcdE1$",
  color: "green",
  nickname: "jane123"
};

const v = new Confirm(payload);

v
  .isString("name", undefined, 3, 50, "first")
  .isEmail("email")
  .isInteger("birthYear", undefined, 1900, 2025)
  .isFloat("score", undefined, 0, 100)
  .isArray("tags", undefined, 1, 10)
  .isBoolean("active")
  .isDate("startDate")
  .isPassword("secret", { minLength: 6, minUpper: 1, minDigits: 1, minSymbols: 1 })
  .isDuplicate("secret", "secretConfirm")
  .isEnum("color", undefined, ["Red", "Green", "Blue"])
  .isRegEx("nickname", undefined, /^[A-Za-z0-9_]+$/, true);

if (v.errors.length > 0) {
  console.error("Errors:", v.errors);
} else {
  console.log("Validated data:", payload);
}

```
