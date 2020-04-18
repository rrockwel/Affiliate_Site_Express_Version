const express = require('express');
const path = require('path');
const index = require('./routes/index');
const user = require('./routes/users');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || "8000";
// Passport Config
require('./config/passport')(passport);

// Set up view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Set Up Body Parser
app.use(bodyParser.urlencoded({ extended : true }))

// Express Session
app.use(session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
)

// Passport Initialize
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


// Set up static directory
app.use(express.static(path.join(__dirname, 'public')));

// Set App to use Routes Index File For Routes
app.use(index);
app.use(user);

// Start Server on Environment Port or Port 8000
app.listen(port, ()=>{
	console.log(`Listening on port ${port}`);
})

