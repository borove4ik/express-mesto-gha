const userRouter = require('express').Router();
const {usersIdValidation, userInfoValidation, userAvatarValidation} = require('../middlewares/celebrateValidation')
const {
  getUsers,
  updateUser,
  updateAvatar,
  getAuthorizedUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

// userRouter.get('/:userId', getUserById);

userRouter.patch('/me', userInfoValidation, updateUser);

userRouter.patch('/me/avatar', userAvatarValidation, updateAvatar);

userRouter.get('/me', usersIdValidation, getAuthorizedUserInfo);

module.exports = userRouter;
