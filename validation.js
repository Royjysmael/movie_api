const Joi = require("joi");

const userSchema = Joi.object({
  Username: Joi.string().alphanum().min(3).max(30).required(),
  Password: Joi.string().min(6).required(),
  Email: Joi.string().email().required(),
  Birthday: Joi.date().optional(),
});

module.exports = { userSchema };
