const Joi = require('joi');

module.exports = {
    register: Joi.object().keys({
        firstName: Joi.string().required(),
        email: Joi.required(),
        password: Joi.string().required()
    }),
    login: Joi.object().keys({
        email: Joi.required(),
        password: Joi.string().required()
    })
    ,
    friendRequest: Joi.object().keys({
        userFrom: Joi.required(),
        userT0: Joi.string().required()
    })
}