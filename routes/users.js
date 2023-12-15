const userRouter = require('express').Router();
const { usersIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares/celebrateValidation');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getAuthorizedUserInfo,
} = require('../controllers/users');
// const auth = require('../middlewares/auth');

userRouter.get('/', getUsers);

userRouter.get('/me', getAuthorizedUserInfo);

userRouter.get('/:userId', usersIdValidation, getUser);

userRouter.patch('/me', userInfoValidation, updateUser);

userRouter.patch('/me/avatar', userAvatarValidation, updateAvatar);

module.exports = userRouter;
