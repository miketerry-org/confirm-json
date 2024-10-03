// index.js: main entry pointt for json-rules package

// load all required packages
const enums = require("./lib/enums.js");
const types = require("./lib/types.js");
const { add, remove, update } = require("./lib/rules.js");

// export rule functions and enum/type lists
module.exports = { add, remove, update, enums, types };
