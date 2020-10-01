const express = require('express')
const router = express.Router();
const userController = require('./userController');

router.post('/create', userController.create);
router.get('/email', userController.email);
router.post('/checkemail', userController.checkEmail);
router.post('/questionOfTheDay', userController.questionOfTheDay);
router.post('/answer', userController.answerOfTheDay);
router.get('/addquestion', userController.addQuestionsInDb);

module.exports = router;