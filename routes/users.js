const userRouter = require('express').Router();
const { usersIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares/celebrateValidation');
const {
  getUsers,
  updateUser,
  updateAvatar,
  getAuthorizedUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

userRouter.get('/', getUsers);

// userRouter.get('/:userId', getUserById);

userRouter.patch('/me', auth, userInfoValidation, updateUser);

userRouter.patch('/me/avatar', auth, userAvatarValidation, updateAvatar);

userRouter.get('/me', usersIdValidation, getAuthorizedUserInfo);

module.exports = userRouter;
