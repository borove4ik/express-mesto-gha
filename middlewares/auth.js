const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    if ((authorization && authorization.startsWith('Bearer '))) {
      const token = authorization.replace('Bearer ', '');
      payload = jwt.verify(token, 'secret-key');
      req.user = payload;
      next();
    } else {
      next(new UnauthorizedError('Неверные авторизационные данные 14'));
    }
  } catch (error) {
    next(new UnauthorizedError('Неверные авторизационные данные'));
  }
};
