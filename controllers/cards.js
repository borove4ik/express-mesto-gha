const card = require('../models/card');

const statuses = require('../utils/statusCodes');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(statuses.SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((newCard) => res.status(statuses.CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось добавить карточку' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  card
    .deleteOne({ _id: cardId })
    .then((message) => {
      if (message.deletedCount === 0) {
        res.status(statuses.NOT_FOUND).send('Карточка не найдена');
      } else {
        res.send(message);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось добавить карточку' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((likedCard) => res.status(statuses.OK_REQUEST).send(likedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось добавить лайк' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((dislikedCard) => res.status(statuses.OK_REQUEST).send(dislikedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(statuses.BAD_REQUEST)
          .send({ message: 'Не удалось удалить лайк' });
      } else {
        res.status(statuses.SERVER_ERROR)
          .send({ message: 'Ошибка на стороне сервера' });
      }
    });
};
