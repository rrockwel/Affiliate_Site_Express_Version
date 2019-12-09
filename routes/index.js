const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const affiliates = require('../public/affiliates.json');

// GET Home Page
router.get('/', (req,res,next)=>{
	res.render('index', { data: affiliates});
})

router.get('/about', (req,res,next)=>{
	res.render('about');

})

router.get('/contact', (req,res,next)=>{
	res.render('contact');

})



// router.get('/register', (req,res,next)=>{
// 	res.render('register');
// })

// router.get('/login', (req, res, next)=>{
// 	res.render('login');
// })

// Setup OAuth2 Client
const oauth2Client = new OAuth2(
		"722991773509-trkerc8r9ccc5o2mb09r7k85g1te02m4.apps.googleusercontent.com",
		"sxS1IPwYFqmGf_NddCTBODni",
		"https://developers.google.com/oauthplayground"
	)

oauth2Client.setCredentials({
	refresh_token: "1//04qw__CiH0vKHCgYIARAAGAQSNwF-L9IrdebV0HF9ODHC8vLsgxqwCHZsq6onu5xTb06Xr85wSB0MnMFnJizk3w4RezxHO1hVG04"
});

const accessToken = oauth2Client.getAccessToken();

router.post('/contact', (req,res, next)=>{
	console.log(req.body, req.body.firstName);
	// Instantiate SMTP Server
	const smtpTrans = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: "OAuth2",
			user: 'vtboarder69@gmail.com',
			clientId: '722991773509-trkerc8r9ccc5o2mb09r7k85g1te02m4.apps.googleusercontent.com',
			clientSecret: 'sxS1IPwYFqmGf_NddCTBODni',
			refreshToken: '1//04qw__CiH0vKHCgYIARAAGAQSNwF-L9IrdebV0HF9ODHC8vLsgxqwCHZsq6onu5xTb06Xr85wSB0MnMFnJizk3w4RezxHO1hVG04',
			accessToken: accessToken
		}
	})

	// Specify Email Structure
	const mailOpts = {
		from: `${req.body.email}`,
		to: 'vtboarder69@gmail.com',
		subject: 'New Message From Affiliate Site Contact Form',
		text: `${req.body.firstName} ${req.body.lastName} (${req.body.email}) says: ${req.body.message}`
	}

	// Attempt to Send Email
	smtpTrans.sendMail(mailOpts, (error, response)=>{
		if(error){
			res.render('contact-failure') // Display Failure Page
			console.log(error);
		}

		else{
			res.render('contact-success') // Display Success Page
			console.log('Message %s sent: %s', info.messageId, info.response)
		}
	})
})

module.exports = router;