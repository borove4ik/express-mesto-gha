const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.authToken;
    payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Неверные авторизационные данные'));
  }
};
