const express = require('express')
const router = express.Router();
const dashboardController = require('./dashboardController');

router.post('/list/users', dashboardController.listUsers);
router.get('/user/show/:id', dashboardController.detailUser);
router.get('/admin', dashboardController.adminPage);
router.post('/answersbydate', dashboardController.answersPage);

module.exports = router;
