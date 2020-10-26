const mongoose = require('mongoose');
const viewHelper = require('../../views/view_handler');
const User = mongoose.model('User');
const Answer = mongoose.model('Answer');
let moment = require('moment');

exports.adminPage = async (req, res) => {
    return viewHelper.renderViewWithParams({}, res, {view : "admin"});
}

exports.listUsers = async (req, res) => {
    let token = req.body.admin_token;
    let admin_user = await User.findOne({token});
    if(!admin_user || admin_user.email != 'samaksh.gupta@live.com' || admin_user.email != 'nitya.kuthiala@gmail.com' || admin_user.email != 'sakshijawarani96@gmail.com'){
        req.flash('error', 'Unauthorized Access');
        return res.redirect('/home');
    }
	try{
    let users = await User.find({}).sort({createdAt : -1});
    let length = users.length;
	return viewHelper.renderViewWithParams({user: users, length: length}, res, {view : 'users'});
	} catch(ex){
		console.log("Exception",ex);
		return res.redirect('/');
	};
}

exports.answersPage = async (req, res) => {
    let answers = await Answer.find({}).sort({createdAt: 'descending'}).populate('user');
    console.log(answers)
    return viewHelper.renderViewWithParams({answers: answers}, res, {view : 'date'});
}

exports.detailUser = async (req, res) => {
	let user = await User.findById(req.params.id);
    let user_answers = await Answer.find({user: req.params.id});
	return viewHelper.renderViewWithParams({user : user, question: user_answers}, res, {view : "view_user"});
}


