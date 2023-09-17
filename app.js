require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
// обработчик ошибок от celebrate
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const generalErrorHandler = require('./middlewares/generalErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const mainRouter = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

// Слушаем 4000 порт
const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();
app.use(cors());

// Парсим входящие запросы в формате JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use('/', mainRouter);

// Обработчик несуществующих путей
app.use('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Запрашиваемый ресурс не найден' }));
});

app.use(errorLogger);

// middleware для обработки ошибок валидации от celebrate
app.use(errors());

app.use(generalErrorHandler);

app.listen(PORT);
