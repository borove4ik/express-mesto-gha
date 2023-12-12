const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  // createUser,
  updateUser,
  updateAvatar,
  // login,
  getAuthorizedUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

// userRouter.get('/:userId', getUserById);

userRouter.patch('/me', auth, updateUser);

userRouter.patch('/me/avatar', auth, updateAvatar);

userRouter.get('/me', auth, getAuthorizedUserInfo);

module.exports = userRouter;
