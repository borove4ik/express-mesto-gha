const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbiddenError');
const BadRequestError = require('../errors/badRequest');

const card = require('../models/card');

const statuses = require('../utils/statusCodes');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
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
        return next(new BadRequestError('Не удалось создать карточку'));
      }
      return next(err);
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
      return requestedCard.deleteOne();
    })
    .then(() => res.status(statuses.OK_REQUEST).send({ message: 'Полномочия подтверждены: удалено' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((likedCard) => res.status(statuses.OK_REQUEST).send(likedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Не удалось добавить лайк'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail(new NotFoundError('Картчока с данным id не найдена'))
    .then((dislikedCard) => res.status(statuses.OK_REQUEST).send(dislikedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Не удалось добавить лайк'));
      }
      return next(err);
    });
};
