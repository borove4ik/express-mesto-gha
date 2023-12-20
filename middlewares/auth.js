const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies._id;
    payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    console.log(payload, req.user, token);
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Неверные авторизационные данные'));
  }
};
