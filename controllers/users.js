const user = require('../models/user');

const statuses = require('../utils/statusCodes');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(statuses.SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((newUser) => res.status(statuses.CREATED).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось добавить пользователя' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .then((userData) => {
      if (!userData) {
        res.status(statuses.NOT_FOUND).send('Пользователь не найден');
      } else {
        res.send(userData);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось добавить пользователя' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.updateUser = async (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  user
    .findByIdAndUpdate({ _id }, { name, about }, { new: true, runValidators: true })
    .then(() => {
      res.status(statuses.OK_REQUEST).send({ _id, name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось обновить информацию' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  user
    .updateOne({ _id }, { avatar })
    .then(() => {
      res.status(statuses.OK_REQUEST).send({ _id, avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось обновить аватар' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};
