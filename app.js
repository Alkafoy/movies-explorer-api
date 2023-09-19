require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./utils/rateLimiter');
const generalErrorHandler = require('./middlewares/generalErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const mainRouter = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

const { PORT, DB_URL } = require('./utils/config');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use('/', mainRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Запрашиваемый ресурс не найден' }));
});

app.use(errorLogger);

// middleware для обработки ошибок валидации от celebrate
app.use(errors());

app.use(generalErrorHandler);

app.listen(PORT);
