/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth')

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

app.use('/users', userRouter);
app.use('/cards', auth, cardRouter);


app.all('*', (req, res) => {
  res.status(statuses.NOT_FOUND).send({message: 'Запрашиваемый ресурс не найден'})
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(cookieParser())

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({message: err.message})
})