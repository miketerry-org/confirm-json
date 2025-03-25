!!ERROR, this needs to be rewritten

# confirm-jsonconfirm-json

<a name="module_confirm-jsonconfirm-json"></a>

## confirm-jsonconfirm-json

The `confirm-jsonconfirm-json` package is designed to be used with Express and other backend frameworks
to validate JSON objects sent from the browser. It ensures that incoming data meets all
specified requirements before it is saved to the database. By utilizing this package,
developers can enforce data integrity, reduce errors, and enhance the security of their
applications by preventing invalid or malicious data from being processed.

Developers define validation rules using `rules.add` to create one or more sets of rules.
When declaring an `app.post` or `app.put` route, developers can utilize the middleware
function provided by `confirm-jsonconfirm-json` to validate incoming requests. This middleware will
attach a `req.errors` property to the request object, allowing route handlers to check
for validation success and report any errors back to the user.

**Section**: Adding Rules
Rules are added using `rules.add(name, [array of strings])`, where each string is a
comma-separated value that includes the following parameters:

- `name`: The name of the field to validate.
- `type`: The data type to validate against.
- `required/optional`: Indicates if the field is required or optional.
- `default`: A default value if the field is not provided.
- Other parameters specific to the data type, as applicable.  
  **Section**: Predefined Types
  The package comes with support for the following predefined types:
- `authRole`: An enumeration that validates user roles, with default values of
  `guest`, `subscriber`, and `admin`. This can be configured by adding an
  `AUTH_ROLE` environment variable, such as `AUTH_ROLE=Guest,Student,Teacher,Admin`,
  which would override the default roles for the `authRole` data type.
- `boolean`: Ensures the value is a boolean.
- `compare`: Compares values for equality.
- `date`: Validates date formats, which must be in the form "yyyy-mm-dd."
- `email`: Ensures the value is a valid email address.
- `enum`: Checks if the value is within a specified set of allowed values.
- `float`: Validates floating-point numbers. Two optional parameters are the minimum and
  maximum values.
- `integer`: Validates integer values. Two optional parameters are the minimum and
  maximum values.
- `password`: Validates password complexity. The following environment variables can be
  used to override the default configuration for password verifications:
  - `PASSWORD_MIN_LENGTH`: Minimum length of the password (default is 8).
  - `PASSWORD_MIN_UPPER`: Minimum number of uppercase letters (default is 1).
  - `PASSWORD_MIN_LOWER`: Minimum number of lowercase letters (default is 1).
  - `PASSWORD_MIN_DIGIT`: Minimum number of digits (default is 1).
  - `PASSWORD_MIN_SYMBOL`: Minimum number of symbols (default is 1).
- `regex`: Validates against a regular expression.
- `string`: Ensures the value is a string, with optional minimum and maximum length.
- `time`: Validates time formats.

Additionally, developers can use the `types` object to add or update any custom data types
they need, allowing for conversion from a string (part of the rules) to a custom validator.  
**Section**: Adding Enumerations
New enumerations can be added using the `enums.add` method. For example:

- To add a gender enumeration: `enums.add("gender", "Male,Female,Non-Binary");`
- To add an education enumeration: `enums.add("Education", "High School,GED,Bachelor,Master,Doctorate");`

Enumerations can also be updated using the `enums.update` function to modify existing values
as needed.  
**Example**

```js
const jsonRules = require("confirm-jsonconfirm-json");

// Define rules
const rules = jsonRules.rules();
const authRoleRules = [
  "firstname,string,required,,1,20",
  "lastname,string,required,,1,20",
  "email,email,required,,1,80",
  "confirmEmail,confirm,required,,email",
  "password,password,required,,8,40",
  "confirmPassword,confirm,,password",
  "dob,date,optional,,",
  "gpa,float,optional,0.0,0.0,4.0",
];
rules.add("myRulesForAddUser", authRoleRules);

// Example usage with Express
app.post("/api/user", rules.middleware("myRulesForAddUser"), (req, res) => {
  if (req.errors) {
    return res.status(400).json({ errors: req.errors });
  }

  // Proceed to save valid data to the database
});
```

## Functions

<dl>
<dt><a href="#add">add(title, rules)</a> ⇒ <code>Object</code></dt>
<dd><p>Adds a named array of rules to the registry.</p>
</dd>
<dt><a href="#find">find(title)</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Finds the specified titled rules in the registry.</p>
</dd>
<dt><a href="#middleware">middleware(title)</a> ⇒ <code>function</code></dt>
<dd><p>Middleware function used when data validation is needed.</p>
</dd>
<dt><a href="#validate">validate(title, data)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Validates the data using specified rules.</p>
</dd>
</dl>

<a name="add"></a>

## add(title, rules) ⇒ <code>Object</code>

Adds a named array of rules to the registry.

**Kind**: global function  
**Returns**: <code>Object</code> - - The newly parsed rules object.  
**Throws**:

- <code>Error</code> - Throws an error if rules with the specified title are already registered.

| Param | Type                              | Description                      |
| ----- | --------------------------------- | -------------------------------- |
| title | <code>string</code>               | The title of the rules to add.   |
| rules | <code>Array.&lt;string&gt;</code> | An array of rule strings to add. |

<a name="find"></a>

## find(title) ⇒ <code>Object</code> \| <code>undefined</code>

Finds the specified titled rules in the registry.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - - Returns the rules object if found, otherwise undefined.

| Param | Type                | Description                     |
| ----- | ------------------- | ------------------------------- |
| title | <code>string</code> | The title of the rules to find. |

<a name="middleware"></a>

## middleware(title) ⇒ <code>function</code>

Middleware function used when data validation is needed.

**Kind**: global function  
**Returns**: <code>function</code> - - Express middleware function.

| Param | Type                | Description                                   |
| ----- | ------------------- | --------------------------------------------- |
| title | <code>string</code> | The title of the rules to use for validation. |

<a name="validate"></a>

## validate(title, data) ⇒ <code>Array.&lt;string&gt;</code>

Validates the data using specified rules.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - - An array of error messages, if any.  
**Throws**:

- <code>Error</code> - Throws an error if the specified set of rules is not defined.

| Param | Type                | Description                                 |
| ----- | ------------------- | ------------------------------------------- |
| title | <code>string</code> | The title of the rules to validate against. |
| data  | <code>Object</code> | The data object to validate.                |

<a name="module_types"></a>

## types

Module for managing predefined data types and their validators.

This module provides a set of predefined data types that can be used in validation rules.
Each data type is associated with a specific validator function that follows the convention:
the first part of the parser function name corresponds to the type string specified in the rules.

Predefined Data Types:

- `authRole`: Validator for authentication roles.
- `boolean`: Validator for boolean values.
- `compare`: Validator for comparing values.
- `date`: Validator for date values.
- `email`: Validator for email addresses.
- `enum`: Validator for enumerated values.
- `float`: Validator for floating-point numbers.
- `integer`: Validator for integer values.
- `password`: Validator for password strength.
- `regex`: Validator for regular expressions.
- `string`: Validator for string values.
- `time`: Validator for time values.

Use the `validate` function to validate data against a specified rule using the appropriate validator.
The `rule.type` must match one of the predefined types listed above.

- [types](#module_types)
  - [~add(type, validator)](#module_types..add)
  - [~find(type)](#module_types..find) ⇒ <code>Object</code> \| <code>undefined</code>
  - [~remove(type)](#module_types..remove)
  - [~update(type, validator)](#module_types..update)
  - [~validate(rule, data, errors)](#module_types..validate) ⇒ <code>\*</code>

<a name="module_types..add"></a>

### types~add(type, validator)

Adds a type handler to the global list.

**Kind**: inner method of [<code>types</code>](#module_types)  
**Throws**:

- <code>Error</code> If the type is already defined.

| Param     | Type                  | Description                                      |
| --------- | --------------------- | ------------------------------------------------ |
| type      | <code>string</code>   | The type to add.                                 |
| validator | <code>function</code> | The validator function associated with the type. |

<a name="module_types..find"></a>

### types~find(type) ⇒ <code>Object</code> \| <code>undefined</code>

Searches the global list of type handlers for the specified type.

**Kind**: inner method of [<code>types</code>](#module_types)  
**Returns**: <code>Object</code> \| <code>undefined</code> - The type handler object if found, otherwise undefined.

| Param | Type                | Description             |
| ----- | ------------------- | ----------------------- |
| type  | <code>string</code> | The type to search for. |

<a name="module_types..remove"></a>

### types~remove(type)

Removes the specified type handler from the global array.

**Kind**: inner method of [<code>types</code>](#module_types)

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| type  | <code>string</code> | The type to remove. |

<a name="module_types..update"></a>

### types~update(type, validator)

Updates a predefined type parser.

**Kind**: inner method of [<code>types</code>](#module_types)  
**Throws**:

- <code>Error</code> If the type is not defined.

| Param     | Type                  | Description              |
| --------- | --------------------- | ------------------------ |
| type      | <code>string</code>   | The type to update.      |
| validator | <code>function</code> | The new parser function. |

<a name="module_types..validate"></a>

### types~validate(rule, data, errors) ⇒ <code>\*</code>

Validates data against a specified rule using a validator function.

**Kind**: inner method of [<code>types</code>](#module_types)  
**Returns**: <code>\*</code> - Returns the result of the validation.  
**Throws**:

- <code>Error</code> Throws an error if the type specified in rule is not defined.

| Param  | Type                | Description                                    |
| ------ | ------------------- | ---------------------------------------------- |
| rule   | <code>Object</code> | The rule object containing type and validator. |
| data   | <code>\*</code>     | The data to be validated.                      |
| errors | <code>Array</code>  | Array to store validation errors.              |

## Functions

<dl>
<dt><a href="#add">add(name, values)</a></dt>
<dd><p>Adds a new enumerated type.</p>
</dd>
<dt><a href="#find">find(name)</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Finds an enumerated type by name.</p>
</dd>
<dt><a href="#remove">remove(name)</a></dt>
<dd><p>Removes an enumerated type by name.</p>
</dd>
<dt><a href="#update">update(name, values)</a></dt>
<dd><p>Updates the values of an existing enumerated type.</p>
</dd>
</dl>

<a name="add"></a>

## add(name, values)

Adds a new enumerated type.

**Kind**: global function

| Param  | Type                | Description                                     |
| ------ | ------------------- | ----------------------------------------------- |
| name   | <code>string</code> | The name of the enumerated type.                |
| values | <code>Array</code>  | The values associated with the enumerated type. |

<a name="find"></a>

## find(name) ⇒ <code>Object</code> \| <code>undefined</code>

Finds an enumerated type by name.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - - Returns the enumerated type object if found, otherwise undefined.

| Param | Type                | Description                              |
| ----- | ------------------- | ---------------------------------------- |
| name  | <code>string</code> | The name of the enumerated type to find. |

<a name="remove"></a>

## remove(name)

Removes an enumerated type by name.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if the enumerated type does not exist.

| Param | Type                | Description                                |
| ----- | ------------------- | ------------------------------------------ |
| name  | <code>string</code> | The name of the enumerated type to remove. |

<a name="update"></a>

## update(name, values)

Updates the values of an existing enumerated type.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if the enumerated type does not exist.

| Param  | Type                | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| name   | <code>string</code> | The name of the enumerated type to update. |
| values | <code>Array</code>  | The new values for the enumerated type.    |

## Functions

<dl>
<dt><a href="#valueValidator">valueValidator(rule, data, parser, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates the value against the specified rule and data.</p>
</dd>
<dt><a href="#authRoleValidator">authRoleValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates an authentication role field.</p>
</dd>
<dt><a href="#booleanValidator">booleanValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a boolean field.</p>
</dd>
<dt><a href="#compareValidator">compareValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Compares a specified data property with another for validation.
Throws an error if the comparison property name is missing or invalid.</p>
</dd>
<dt><a href="#dateValidator">dateValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a date field.</p>
</dd>
<dt><a href="#emailValidator">emailValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates an email field.</p>
</dd>
<dt><a href="#enumValidator">enumValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a value against a set of enumerated options.</p>
</dd>
<dt><a href="#floatValidator">floatValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a floating-point number field.</p>
</dd>
<dt><a href="#integerValidator">integerValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates an integer field.</p>
</dd>
<dt><a href="#passwordValidator">passwordValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a password field.</p>
</dd>
<dt><a href="#regexValidator">regexValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a value in the data object against a regular expression specified in the rule.</p>
</dd>
<dt><a href="#stringValidator">stringValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a string field.</p>
</dd>
<dt><a href="#timeValidator">timeValidator(rule, data, errors)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a time field.</p>
</dd>
</dl>

<a name="valueValidator"></a>

## valueValidator(rule, data, parser, errors) ⇒ <code>boolean</code>

Validates the value against the specified rule and data.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                                                           |
| ------ | --------------------------------- | ------------------------------------------------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object containing the property name and validation settings.      |
| data   | <code>Object</code>               | The data object to validate, which should contain the property specified in the rule. |
| parser | <code>function</code>             | The parser function to convert the data value.                                        |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages.                                           |

<a name="authRoleValidator"></a>

## authRoleValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates an authentication role field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="booleanValidator"></a>

## booleanValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a boolean field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="compareValidator"></a>

## compareValidator(rule, data, errors) ⇒ <code>boolean</code>

Compares a specified data property with another for validation.
Throws an error if the comparison property name is missing or invalid.

**Kind**: global function  
**Returns**: <code>boolean</code> - Returns true if the values are the same, otherwise false.  
**Throws**:

- <code>Error</code> Throws an error if the comparison property name is missing or invalid.

| Param  | Type                              | Description                                       |
| ------ | --------------------------------- | ------------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule containing parameters.        |
| data   | <code>Object</code>               | The data object containing values to be compared. |
| errors | <code>Array.&lt;string&gt;</code> | An array to collect error messages.               |

<a name="dateValidator"></a>

## dateValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a date field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="emailValidator"></a>

## emailValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates an email field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="enumValidator"></a>

## enumValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a value against a set of enumerated options.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.  
**Throws**:

- <code>Error</code> - Throws an error if the enum validator is not implemented.

| Param  | Type                              | Description                                                |
| ------ | --------------------------------- | ---------------------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object containing the enum parameters. |
| data   | <code>Object</code>               | The data object to validate.                               |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages.                |

<a name="floatValidator"></a>

## floatValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a floating-point number field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="integerValidator"></a>

## integerValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates an integer field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="passwordValidator"></a>

## passwordValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a password field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="regexValidator"></a>

## regexValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a value in the data object against a regular expression specified in the rule.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if the value matches the regex, otherwise false.  
**Throws**:

- <code>Error</code> - Throws an error if the regex is not provided or invalid.

| Param       | Type                | Description                                                        |
| ----------- | ------------------- | ------------------------------------------------------------------ |
| rule        | <code>Object</code> | The validation rule object.                                        |
| rule.name   | <code>string</code> | The name of the rule, used as the key in the data object.          |
| rule.params | <code>Array</code>  | The parameters for the rule, where the first element is the regex. |
| data        | <code>Object</code> | The object containing values to validate.                          |
| errors      | <code>Object</code> | An object to accumulate error messages.                            |

<a name="stringValidator"></a>

## stringValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a string field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |

<a name="timeValidator"></a>

## timeValidator(rule, data, errors) ⇒ <code>boolean</code>

Validates a time field.

**Kind**: global function  
**Returns**: <code>boolean</code> - - Returns true if validation succeeds, false otherwise.

| Param  | Type                              | Description                                 |
| ------ | --------------------------------- | ------------------------------------------- |
| rule   | <code>Object</code>               | The validation rule object.                 |
| data   | <code>Object</code>               | The data object to validate.                |
| errors | <code>Array.&lt;string&gt;</code> | Array to collect validation error messages. |
