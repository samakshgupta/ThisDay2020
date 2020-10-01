const mongoose = require('mongoose');
const viewHelper = require('../../views/view_handler');
const User = mongoose.model('User');
const Answer = mongoose.model('Answer');

exports.adminPage = async (req, res) => {
    return viewHelper.renderViewWithParams({}, res, {view : "admin"});
}

exports.listUsers = async (req, res) => {
    let token = req.body.admin_token;
    let admin_user = await User.findOne({token});
    if(!admin_user || admin_user.email != 'samaksh.gupta@live.com'){
        req.flash('error', 'Unauthorized Access');
        res.redirect('/home');
    }
	try{
    let users = await User.find({}).sort({createdAt : -1});
	return viewHelper.renderViewWithParams({user: users}, res, {view : 'users'});
	} catch(ex){
		console.log("Exception",ex);
		res.redirect('/');
	};
}

exports.detailUser = async (req, res) => {
	let user = await User.findById(req.params.id);
    let user_answers = await Answer.find({user: req.params.id});
	return viewHelper.renderViewWithParams({user : user, question: user_answers}, res, {view : "view_user"});
}


