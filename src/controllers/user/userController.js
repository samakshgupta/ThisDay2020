
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
	cron_date.setDate(cron_date.getDate() + 2);
	cron_date.setHours(5,30,0,0);

	let token = uuidv4();

	let user = new User({email, city, country, age, gender, token, cron_date, time});
	await user.save();

	req.flash('success', 'Welcome to This Day 2020! Thank you for signing up.');
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
		res.redirect('/home');
	}
	let token = user.token;
	return viewHelper.renderViewWithParams({token}, res, {view : 'home',  request : req});
}

exports.questionOfTheDay = async ( req, res ) => {
	let token = req.body.token;
	let half = false;
	let last_ten = false;
	let last = false;
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
			res.redirect('/');
		}
		if(question_no == 30){
			half = true;
		}
		if(question_no == 50){
			last_ten = true;
		}
		if(question_no == 60){
			last = true;
		}
		return viewHelper.renderViewWithParams({question: question.question, user_id: user.id, half, last_ten, last}, res, {view : 'question_page',  request : req});
	}
}

exports.answerOfTheDay = async ( req, res ) => {
	let question = req.body.question;
	let answer = req.body.answer;
	let user = req.body.user_id;
	let data = new Answer({question, answer, user});
	await data.save();
	req.flash('success', 'Thank you for answering! Your next question will come up in 2 days');
	res.redirect('/');
}

exports.addQuestionsInDb = async (req, res) => {
	let got_ques = await Question.find({});
	let questions = [
			'If not for this pandemic, where would you have been right now and what would you be doing?',
			'What was the first thought you had this morning?',
			'If you had to make a movie about your quarantine experience, what would its name be?',
			'How has this time changed your relationship with your family, if at all?',
			'Has this experience made you more or less materialistic? Why do you think that is?',
			'Describe the last dream you remember',
			'What’s the one thing you find yourself doing everyday, that you didn’t do pre-covid?',
			'Who’s the newest person that’s come into your life? Describe your relationship with them',
			'What’s one thing you wish everyone knew about you?',
			'Who do you wish you were quarantining with and why?',
			'What’s a bad habit you’ve picked up during this time?',
			'What’s one new thing you’ve learnt about yourself during this time?',
			'How are you caring for yourself doing this time? What does your self-care routine look like?',
			'Who’s the one person who’s made this time easier to deal with? Describe how they’ve helped you during this time',
			'When was the last time you met your friends? What was that like?',
			'What did you learn about the world today, that you didn’t know yesterday?',
			'What would you say to your future self? (try writing a short letter!)',
			'What was the last thing that made you laugh?',
			'What’s your work-from-home routine? Describe it in as much detail as you’d like',
			'Do you reminisce about a particular holiday you took pre-covid? Share your best memory from that trip',
			'What’s been the hardest thing you’ve had to deal with during covid?',
			'Have you been recycling outfits during covid? Describe the item of clothing you’ve worn the most',
			'When was the last time you were in love?',
			'Describe the time you helped someone over the last 6 months',
			'Has time passed more quickly or slowly during your covid experience? Why do you think that is?',
			'What’s one thing you miss doing the most?',
			'Describe the last meaningful conversation you had with someone',
			'What’s something new that you’ve added to your daily routine?',
			'Share what you are feeling grateful for today',
			'What is the first thing you want to do when this is all over?',
			'What’s the last text message you sent?',
			'What are you wishing for today?',
			'If COVID19 was a type of food, what would it be and why?',
			'What’s your favourite spot in your house? Why is it your favourite?',
			'Share a quote or some advice that has given you strength during this time',
			'What news sources/types of stories have you followed during covid? Have your reading habits changed?',
			'What would you say to someone you wish you were still in touch with? (try writing a short letter!)',
			'What is one thing you think you’ll never do again, once this is all over?',
			'Share the recipe of the last thing you cooked',
			'Who was the last person you met? Describe that experience',
			'Share a story of hope during this time',
			'Describe your relationship with someone in your community (think outside your immediate circle)',
			'Describe the best tv show/movie you’ve watched during covid',
			'Describe your happy place, and who’s there with you',
			'How did you spend the last weekend?',
			'If you could change something from the last 5 months, what would you change and why?',
			'Moving forward, what 3 things do you want to remember from this time?',
			'What new hobby or skill have you picked up?',
			'Describe your day in 3 words',
			'Where were you on the 1st of January, 2020? What were the resolutions you made for this year?',
			'Where do you see yourself a year from today?',
			'What was the last thing you bought?',
			'If you could change places with anyone around the world right now, who would you choose and why?',
			'What’s one thing you’d want to remember from today?',
			'Who’s the last person you called? What did you talk about?',
			'What’re the 3 things you’d like to do as soon as things return to some sort of normalcy?',
			'When was the last time you went out? Describe that experience',
			'If you could carry one thing with you when this is all over, what would it be?',
			'What has this pandemic taught you about your country?',
			'How would you like to remember this time?'
		]
	if(got_ques.length !== 60){
		let day = 0;
		questions.forEach(async q => {
			day = day+1;
			let new_q = new Question({question: q, day});
			await new_q.save();
		})
	}
	res.redirect('/');
}
