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
      console.log(err);
      res
        .status(statuses.SERVER_ERROR)
        .send({ message: 'Не удалось добавить карточку' });
    });
};

module.exports.getUserById = async (req, res, next) => {
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
    .catch(next);
};

module.exports.updateUser = async (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  user
    .updateOne({ _id }, { name, about })
    .then(() => {
      res.status(statuses.OK_REQUEST).send({ _id, name, about });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(statuses.BAD_REQUEST)
        .send({ message: 'Не удалось изменить информацию' });
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
      console.log(err);
      res
        .status(statuses.BAD_REQUEST)
        .send({ message: 'Не удалось изменить информацию' });
    });
};
