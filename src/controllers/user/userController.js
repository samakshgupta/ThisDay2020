
const mongoose = require('mongoose');
const viewHelper = require('../../views/view_handler');
const User = mongoose.model('User');
const Question = mongoose.model('Question');
const Answer = mongoose.model('Answer');
const { v4: uuidv4 } = require('uuid');
var moment = require('moment');

exports.create = async (req, res) => {
	let email = req.body.email;
	let city = req.body.city;
	let country = req.body.country;
	let age = req.body.age;
	let gender = req.body.gender;
	let time = req.body.time;

	let cron_date = new Date();
	cron_date.setHours(5,30,0,0);

	let token = uuidv4();

	let user = new User({email, city, country, age, gender, token, cron_date, time});
	await user.save();

	req.flash('success', 'Welcome to Covid Diaries! Thank you for signing up.');
	res.redirect('/'+token);
};

exports.email = async (req, res) => {
	return viewHelper.renderViewWithParams({}, res, {view : 'email',  request : req});
}

exports.checkEmail = async (req,res) => {
	let email = req.body.email;
	let user = await User.findOne({email});
	if(!user){
		req.flash('error', 'Invalid Email. Please sign up!');
		res.redirect('/');
	}
	let token = user.token;
	return viewHelper.renderViewWithParams({token}, res, {view : 'home',  request : req});
}

exports.questionOfTheDay = async ( req, res ) => {
	let token = req.body.token;
	if(!token){
		req.flash('error', 'Unauthorized User');
		res.redirect('/user/email');
	} else {
		let question_no;
		let user = await User.findOne({token});
		let today = moment(new Date());
		let user_createdat = moment(user.createdAt);
		let diff = today.diff(user_createdat, 'days');
		question_no = Math.ceil(diff/2);

		if(question_no == 0){
			question_no = 1;
		}
		let question = await Question.findOne({day: question_no});
		let already_answered = await Answer.findOne({ question: question.question, user: user.id });
		if(already_answered || question_no>71){
			req.flash('error', 'You have already answered!');
			res.redirect('/home');
		}
		return viewHelper.renderViewWithParams({question: question.question, user_id: user.id}, res, {view : 'question_page',  request : req});
	}
}

exports.answerOfTheDay = async ( req, res ) => {
	let question = req.body.question;
	let answer = req.body.answer;
	let user = req.body.user_id;
	let data = new Answer({question, answer, user});
	await data.save();
	req.flash('success', 'Thank you for answering! Your next question will come up in 3 days');
	res.redirect('/home');
}

exports.addQuestionsInDb = async (req, res) => {
	let got_ques = await Question.find({});
	let questions = [
		'What was the first thought you had this morning?',
		'What is the first thing you want to do when this is all over?',
		'What was a new thing you learnt about yourself during this time?',
		'What was the last book you read?',
		'What was the last thing you bought?',
		'Share a picture of your shoes',
		'What was the last meal you cooked yourself?',
		'Share a new recipe you just learnt',
		'When was the last time you went out? Describe that experience',
		'Spend an hour doing something that brings you immense happiness today',
		'What new hobby have you picked up?',
		'If you could carry one thing with you when this is all over, what would it be?',
		'What is your biggest fear?',
		'What do you wish you did, but never did?',
		'Write a letter to someone you lost touch with',
		'What’s your least favourite colour and why?',
		'Share a picture of your last meal',
		'Where were you on the 1st of January, 2020? What were you doing?',
		'What was the last song you listened to?',
		'Describe your happy place',
		'If COVID19 was a type of food, what would it be and why?',
		'What’s your favourite time of year?',
		'Share whatever you want to',
		'Reach out to someone you haven’t heard from in a while, and describe what that felt like',
		'What’s one thing you’d want to remember from today?',
		'Who’s the last person you called?',
		'What’s the last text message you received?',
		'What is one thing you think you’ll never do again, once this is all over?',
		'What’s your favourite word?',
		'What’s one thing you wish everyone knew about you?',
		'Who’s your favourite person?',
		'If your life was a book, what would the title be?',
		'Describe one item of clothing you are currently wearing in detail',
		'What did you have for breakfast?',
		'When was the last time you were in love?',
		'Describe the time you helped someone in the last month',
		'What did you learn about the world today, that you didnt know yesterday?',
		'What was the last movie you watched?',
		'Share a picture from your day',
		'What was the last thing that made you laugh?',
		'Write a short letter to your future self',
		'What were you doing last wednesday?',
		'If not for the pandemic, where would you have been right now?',
		'Share a picture of your sky',
		'What were you doing 2 hours ago?',
		'Describe your day in emojis',
		'What is your favourite article of clothing, and why?',
		'What’s a bad habit you have, you wish you could get rid of?',
		'When was the last time you told someone you love them?',
		'Share a story of hope during this time',
		'What’s your favourite spot in your house?',
		'How did you spend the last weekend?',
		'What is the one thing you find yourself doing everyday?',
		'Share the recipe of the last thing you cooked',
		'Who were the last five people you spoke to?',
		'When was the last time you cleaned your closet?',
		'Share what made you feel grateful today',
		'What was the last thing that frightened you?',
		'What’s the last thing you do before going to bed?',
		'Who was the last person you saw?',
		'What are you wearing?',
		'Share an image of where you sleep',
		'Who’s a new artist you discovered during COVID-19?',
		'What was the last thing you took out of the refrigerator?',
		'When was the last time you met your friends? Describe what you did',
		'Who do you wish you were quarantining with?',
		'Share a picture of yourself',
		'How would you like to remember this time?',
		'What’s something new that you’ve added to your routine?',
		'Upload your favourite picture of a loved one taken recently and share why you love it',
		'Who’s the newest person that’s come into your life? Describe your relationship with them',
		]
	if(got_ques.length !== 71){
		let day = 0;
		questions.forEach(async q => {
			day = day+1;
			let new_q = new Question({question: q, day});
			await new_q.save();
		})
	}
	res.redirect('/');
}
