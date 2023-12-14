const cardRouter = require('express').Router();
const { creatingCardValidation, cardsIdValidation } = require('../middlewares/celebrateValidation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', creatingCardValidation, createCard);

cardRouter.delete('/:cardId', cardsIdValidation, deleteCard);

cardRouter.put('/:cardId/likes', cardsIdValidation, likeCard);

cardRouter.delete('/:cardId/likes', cardsIdValidation, dislikeCard);

module.exports = cardRouter;
