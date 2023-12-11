const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbiddenError');
const BadRequestError = require('../errors/badRequest');

const card = require('../models/card');

const statuses = require('../utils/statusCodes');
const statusCodes = require('../utils/statusCodes');

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

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((newCard) => res.status(statuses.CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не удалось создать карточку'));
      } else {
        next(res.status(statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
      }
    });
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  card
    .findById(cardId).orFail(new NotFoundError('Картчока с данным id не найдена'))
    .then((requestedCard) => {
      if (requestedCard.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Отсутствуют полномочия на удаление искомой единицы(карточки)');
      }
      return card.deleteOne({ _id: cardId });
    })
    .then(() => res.status(statuses.OK_REQUEST).send({ message: 'Полномочия подтверждены: удалено' }))
    .catch((error) => {
      if (error.statusCode === statusCodes.BAD_REQUEST) {
        next(new BadRequestError('Передан некорректный _id карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((likedCard) => res.status(statuses.OK_REQUEST).send(likedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Не удалось добавить лайк'));
      } else {
        next(res.status(statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((dislikedCard) => res.status(statuses.OK_REQUEST).send(dislikedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Не удалось добавить лайк'));
      } else {
        next(res.status(statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
      }
    });
};
