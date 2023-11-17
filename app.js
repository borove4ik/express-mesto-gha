/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const statuses = require('./utils/statusCodes');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '65528043b5000956c2c002c0', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', (req, res) => {
  res.status(statuses.NOT_FOUND).send({message: 'Запрашиваемый ресурс не найден'})
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});