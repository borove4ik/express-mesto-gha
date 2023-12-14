const userRouter = require('express').Router();
const { usersIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares/celebrateValidation');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getAuthorizedUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

userRouter.get('/', getUsers);

userRouter.get('/:userId', usersIdValidation, getUser);

userRouter.patch('/me', auth, userInfoValidation, updateUser);

userRouter.patch('/me/avatar', auth, userAvatarValidation, updateAvatar);

userRouter.get('/me', getAuthorizedUserInfo);

module.exports = userRouter;
