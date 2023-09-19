const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const auth = require('../middlewares/auth');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
// Middleware для аутентификации пользователя для всех роутов ниже
router.use(auth);
router.use('/users', usersRouter);
router.use('/', moviesRouter);

module.exports = router;
