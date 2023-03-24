const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const userControllder = require('../controllers/userpost.controller')
const userfriendController = require('../controllers/userfriend.controller')
const authGuard = require('../middleware/auth.guard');
const schema = require("../validations/auth.validation");
const validate = require('../utils/validator'); 

router.post('/register', validate(schema.register), authController.register);
router.post('/login',    validate(schema.login),    authController.login);

router.post('/sendrequest', authGuard, userfriendController.sendRequest);
router.get('/user' ,                 authController.getUser);
router.get('/checkrequest',      authGuard,         userfriendController.checkFriendRequest);
router.get('/acceptrequest',      authGuard,         userfriendController.acceptFriendRequest);
router.get('/gettingfriendlist', authGuard,         userfriendController.friendList);



router.get('/logout',    authGuard,                 authController.logout);
router.post('/createpost', authGuard, userControllder.createPost);
router.get('/gettingpost', authGuard, userControllder.userGettingPost);
router.get('/search',  authController.userSerach);






router.all('*',  (req, res) => res.status(400).json({ message: 'Bad Request.'}))

module.exports = router;