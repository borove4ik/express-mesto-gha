const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateToken = require('../utils/jwt');
const NotFoundError = require('../errors/notFound');
const MongoDuplicateConflict = require('../errors/mongoDuplicate');
const statuses = require('../utils/statusCodes');
const BadRequestError = require('../errors/badRequest');
const UnauthorizedError = require('../errors/unauthorized');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(statuses.SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password || !email) {
    next(new BadRequestError('Не удалось добавить пользователя'));
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    User
      .create({
        name, about, avatar, email, password: hashedPassword,
      })
      // eslint-disable-next-line no-shadow
      .then((newUser) => res.status(statuses.CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Не удалось добавить пользователя'));
        } else if (err.code === 11000) {
          next(new MongoDuplicateConflict('Пользователь с таким email уже существует'));
        } else {
          next(res.status(statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
        }
      });
  }
};

const getUserById = (req, res, userData, next) => {
  User.findById(userData)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(statuses.OK_REQUEST).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((error) => {
      next(error);
    });
};

module.exports.getUser = async (req, res, next) => {
  const userData = req.params.userId;
  getUserById(req, res, userData, next);
};

module.exports.getAuthorizedUserInfo = (req, res, next) => {
  console.log(req.user);
  const userData = req.user._id;
  getUserById(req, res, userData, next);
};

module.exports.updateUser = async (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User
    .findByIdAndUpdate({ _id }, { name, about }, { new: true, runValidators: true })
    .then(() => {
      res.status(statuses.OK_REQUEST).send({ _id, name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не удалось обновить информацию'));
      } else {
        next(res.status(statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
      }
    });
};

module.exports.updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User
    .updateOne({ _id }, { avatar }, { new: true }, { runValidators: true })
    .then(() => {
      res.status(statuses.OK_REQUEST).send({ _id, avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не удалось обновить аватар'));
      } else {
        next(res.status(statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
      }
    });
};

// eslint-disable-next-line consistent-return
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }).select('+password');
  if (!foundUser) {
    next(new UnauthorizedError('пользователь с таким email не найден'));
  } else {
    const compareResult = await bcrypt.compare(password, foundUser.password);
    if (!compareResult) {
      next(new UnauthorizedError('Неверный пароль'));
    }
    const token = generateToken({ _id: foundUser._id });
    res.cookie('_id', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
      secure: true,

    });
    return res.send({ token });
  }
};
