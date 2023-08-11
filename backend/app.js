require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const errorMiddleware = require('./middlewares/error');
const authMiddleware = require('./middlewares/auth');
const { reqLogger, errLogger } = require('./middlewares/logger');
const ApiError = require('./exceptions/api-error');
const userController = require('./controllers/user');
const avatarUrlRegexp = require('./services/avatarUrlRegexp');
const rateLimit = require('./services/limiter');

const app = express();

app.use(helmet());
app.use(rateLimit);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ['https://ivan.nomoreparties.co', 'http://ivan.nomoreparties.co'],
}));

app.use(reqLogger);
app.use('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userController.login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(avatarUrlRegexp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userController.createUser);
app.use('/users', authMiddleware, usersRouter);
app.use('/cards', authMiddleware, cardsRouter);
app.all('*', (req, res, next) => {
  next(ApiError.NotFound('Неверный URL'));
});
app.use(errLogger);
app.use(errors());
app.use(errorMiddleware);

const { PORT = 4000, DB_URL = 'mongodb://0.0.0.0:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

//  TODO: update profile другого человека
