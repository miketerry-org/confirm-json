// index.js: main entry pointt for confirm-json package

// load all required packages
const enums = require("./lib/enums.js");
const rules = require("./lib/rules.js");
const types = require("./lib/types.js");

/**
 * @module confirm-json
 *
 * @description
 * The `confirm-json` package is designed to be used with Express and other backend frameworks
 * to validate JSON objects sent from the browser. It ensures that incoming data meets all
 * specified requirements before it is saved to the database. By utilizing this package,
 * developers can enforce data integrity, reduce errors, and enhance the security of their
 * applications by preventing invalid or malicious data from being processed.
 *
 * Developers define validation rules using `rules.add` to create one or more sets of rules.
 * When declaring an `app.post` or `app.put` route, developers can utilize the middleware
 * function provided by `confirm-json` to validate incoming requests. This middleware will
 * attach a `req.errors` property to the request object, allowing route handlers to check
 * for validation success and report any errors back to the user.
 *
 * ##Example
 * const jsonRules = require('confirm-json');
 *
 * // Define rules
 * const rules = jsonRules.rules();
 * const authRoleRules = [
 *   'firstname,string,required,,1,20',
 *   'lastname,string,required,,1,20',
 *   'email,email,required,,1,80',
 *   'confirmEmail,confirm,required,,email',
 *   'password,password,required,,8,40',
 *   'confirmPassword,confirm,,password',
 *   'dob,date,optional,,',
 *   'gpa,float,optional,0.0,0.0,4.0',
 * ];
 * rules.add('myRulesForAddUser', authRoleRules);
 *
 * // Example usage with Express
 * app.post('/api/user', rules.middleware('myRulesForAddUser'), (req, res) => {
 *   if (req.errors.length > 0) {
 *     return res.status(400).json({ ok: false, errors: req.errors });
 *   } else {
 *    const data = saveData(req.body);
       res.status(200).send({ok:true, req.body});
  *   }
  * }
  *    
 * @section Adding Rules
 * Rules are added using `rules.add(name, [array of strings])`, where each string is a
 * comma-separated value that includes the following parameters:
 * - `name`: The name of the field to validate.
 * - `type`: The data type to validate against.
 * - `required/optional`: Indicates if the field is required or optional.
 * - `default`: A default value if the field is not provided.
 * - Other parameters specific to the data type, as applicable.
 *
 * @section Predefined Types
 * The package comes with support for the following predefined types:
 * - `authRole`: An enumeration that validates user roles, with default values of
 *   `guest`, `subscriber`, and `admin`. This can be configured by adding an
 *   `AUTH_ROLE` environment variable, such as `AUTH_ROLE=Guest,Student,Teacher,Admin`,
 *   which would override the default roles for the `authRole` data type.
 * - `boolean`: Ensures the value is a boolean.
 * - `compare`: Compares values for equality.
 * - `date`: Validates date formats, which must be in the form "yyyy-mm-dd."
 * - `email`: Ensures the value is a valid email address.
 * - `enum`: Checks if the value is within a specified set of allowed values.
 * - `float`: Validates floating-point numbers. Two optional parameters are the minimum and
 *   maximum values.
 * - `integer`: Validates integer values. Two optional parameters are the minimum and
 *   maximum values.
 * - `password`: Validates password complexity. The following environment variables can be
 *   used to override the default configuration for password verifications:
 *   - `PASSWORD_MIN_LENGTH`: Minimum length of the password (default is 8).
 *   - `PASSWORD_MIN_UPPER`: Minimum number of uppercase letters (default is 1).
 *   - `PASSWORD_MIN_LOWER`: Minimum number of lowercase letters (default is 1).
 *   - `PASSWORD_MIN_DIGIT`: Minimum number of digits (default is 1).
 *   - `PASSWORD_MIN_SYMBOL`: Minimum number of symbols (default is 1).
 * - `regex`: Validates against a regular expression.
 * - `string`: Ensures the value is a string, with optional minimum and maximum length.
 * - `time`: Validates time formats.
 *
 * Additionally, developers can use the `types` object to add or update any custom data types
 * they need, allowing for conversion from a string (part of the rules) to a custom validator.
 *
 * @section Adding Enumerations
 * New enumerations can be added using the `enums.add` method. For example:
 * - To add a gender enumeration: `enums.add("gender", "Male,Female,Non-Binary");`
 * - To add an education enumeration: `enums.add("Education", "High School,GED,Bachelor,Master,Doctorate");`
 *
 * Enumerations can also be updated using the `enums.update` function to modify existing values
 * as needed.
 */

// export the rules, enumerations and types
module.exports = { rules, enums, types };
