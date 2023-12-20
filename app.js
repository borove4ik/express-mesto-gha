/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const {createUser, login} = require('./controllers/users');
const { errors } = require('celebrate')
const { signUpValidation, signInValidation} = require('./middlewares/celebrateValidation');


const { PORT = 3000 } = process.env;

const statuses = require('./utils/statusCodes');
const { celebrate } = require('celebrate');
const NotFoundError = require('./errors/notFound');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);


app.post('/signin', signInValidation, login );

app.post('/signup', signUpValidation, createUser);


app.all('*', (req, res, next) => {
 next(new NotFoundError('Запрашиваемый ресурс не найден'))
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errors());

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.statusCode || 500).send({
    message: !err.statusCode ? 'Ошибка на стороне сервера' : err.message,
  });
})