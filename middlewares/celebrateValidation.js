// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

module.exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.usersIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/),
  }),
});

module.exports.creatingCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/),
  }),
});

module.exports.cardsIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
});
