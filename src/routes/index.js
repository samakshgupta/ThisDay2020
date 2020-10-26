const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Answer = mongoose.model('Answer');
const viewHelper = require('../views/view_handler');
const user = require('../controllers/user');
const dashboard = require('../controllers/dashboard');
const fs = require('fs');
var moment = require('moment');

router.all('/home', async function(req, res){
	let token = await User.findOne({token: req.body.token});
	if(token){
		req.flash('error','You are already signed in!');
		return res.redirect('/');
	}
	const countries_json = fs.readFileSync('country.json');
	const countries = JSON.parse(countries_json);
	return viewHelper.renderViewWithParams({ countries: countries }, res, {view : 'new_home',  request : req})
});

router.get('/aboutus', async function(req, res) {
    return viewHelper.renderViewWithParams({aboutus: true}, res, {view : "aboutus"});
});

router.get('/faqs', async function(req, res) {
    return viewHelper.renderViewWithParams({aboutus: true}, res, {view : "faqs"});
});

router.get('/', async function(req, res){
	let view = 'home';
	return viewHelper.renderViewWithParams({homePage : true, isPublic : true}, res, {view : view,  request : req})
});

/*router.get('/', async function(req, res){
	return viewHelper.renderViewWithParams({homePage : true, isPublic : true}, res, {view : 'coming_soon',  request : req})
});*/

router.get('/token/:token', async function(req, res){
	let token = req.params.token;
	if(token.length == 36){
		return viewHelper.renderViewWithParams({homePage : true, isPublic : true, token: token}, res, {view : 'home',  request : req})
	} else {
		req.flash('error', 'Unauthorized user');
		return res.redirect('/user/email');
	}
});

router.use('/user', user);
router.use('/dashboard', dashboard);

module.exports = router;
