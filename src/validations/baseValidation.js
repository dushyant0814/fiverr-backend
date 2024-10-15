const Joi = require('joi');

const string = Joi.string();
const number = Joi.number();
const boolean = Joi.boolean();
const date = Joi.date();

const stringRequired = string.required();
const numberRequired = number.required();
const booleanRequired = boolean.required();
const dateRequired = date.required();

const customValidations = (schema) => Joi.object(schema);

const arrayValidation = (type) => Joi.array().items(type);

module.exports = {
    customValidations,
    string,
    number,
    boolean,
    date,
    arrayValidation,
    stringRequired,
    numberRequired,
    booleanRequired,
    dateRequired,
};