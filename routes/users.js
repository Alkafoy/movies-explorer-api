const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { editUserData, getUserData } = require('../controllers/users');

const router = express.Router();

// Роут для получения данных пользователя
router.get('/me', getUserData);

// Роут для редактирования данных пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), editUserData);

module.exports = router;
