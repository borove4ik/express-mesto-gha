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

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateAvatar);

userRouter.get('/me', getAuthorizedUserInfo);

module.exports = userRouter;
