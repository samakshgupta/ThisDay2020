const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const viewHelper = require('../views/view_handler');
const user = require('../controllers/user');
const dashboard = require('../controllers/dashboard');

router.get('/home', async function(req, res){
	return viewHelper.renderViewWithParams({}, res, {view : 'new_home',  request : req})
});

router.get('/aboutus', async function(req, res) {
    return viewHelper.renderViewWithParams({aboutus: true}, res, {view : "aboutus"});
});

router.get('/', async function(req, res){
	let view = 'home';
	return viewHelper.renderViewWithParams({homePage : true, isPublic : true}, res, {view : view,  request : req})
});

router.get('/:token', async function(req, res){
	let token = req.params.token;
	if(token.length == 36){
		return viewHelper.renderViewWithParams({homePage : true, isPublic : true, token: token}, res, {view : 'home',  request : req})
	} else {
		req.flash('error', 'Unauthorized user');
		res.redirect('/user/email');
	}
});

router.use('/user', user);
router.use('/dashboard', dashboard);

module.exports = router;
