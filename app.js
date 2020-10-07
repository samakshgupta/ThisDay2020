const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');
const errorController = require('./src/controllers/errors/errorController');
var cron = require('node-cron');
const User = mongoose.model('User');
const request = require('request');
const MAIL_API_KEY = process.env['MAIL_API_KEY'];
const flash = require('express-flash');
var moment = require('moment');

	delete process.env['http_proxy'];
    delete process.env['HTTP_PROXY'];
    delete process.env['https_proxy'];
    delete process.env['HTTPS_PROXY'];
const app = express();

const hbs = require('hbs');

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'hbs'); // Handlebars Engine

//app.engine('html', hbs.__express);

app.use(express.static(path.join(__dirname, 'public/')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    cookie : {maxAge :null},
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));

app.use(flash());


app.use (function (req, res, next) {
  var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
  if (schema === 'https') {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.use('/', routes);
app.use(errorController.notFound);

if(app.get('dev') === 'development'){
    app.use(console.errorController.developmentErrors);
}

require('./src/lib/initializers');

cron.schedule('0 12 * * *', async () => {
    var date = new Date();
    date.setHours(5,30,0,0);
    let users = await User.find({cron_date: date});
    console.log('got it', users);
    users.forEach( async user => {
        let cron_date = moment(user.cron_date).add(2, 'days');
        cron_date = cron_date.format('YYYY-MM-DD');
        user.cron_date = cron_date;
        await user.save();
        const options = {
            method: 'POST',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'api-key': MAIL_API_KEY
            },
            body: {
              sender: {name: 'This Day 2020', email: 'thisdaytwenty20@gmail.com'},
              to: [{email: user.email}],
              replyTo: {email: 'thisdaytwenty20@gmail.com'},
              templateId: 1
            },
            json: true
          };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    })
});

module.exports = app;
