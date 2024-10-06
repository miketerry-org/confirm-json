# json-rules

## data types supported

- authRole
- boolean
- compare
- date
- email
- enum
- float
- integer
- password
- regex
- string
- time

-rules.types.add(name, validator, options = {})

- rules.types.find(name)
- rules.types.delete(name)
- rules.types.validate(name, body, errors)

- rules.register(title, rules)
- let errors = rules.validate(title, body)
- rules.middleware(title) => (req, res, next) => {let errors = rules.validate(title, req.body)}
