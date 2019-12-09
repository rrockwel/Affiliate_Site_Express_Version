const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/user');

// Register User
router.get('/register', (req, res)=>{
	res.render('register', {data: '' });
})

// Login Page
router.get('/login', (req, res) =>{
	res.render('login');
})

// MongoDB
const db = require('../config/keys').MongoURI;
// Connect To Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(()=>console.log("Connected to MongoDB"))
	.catch(err=> console.log(err))

// Post Request On Register Form Submit
router.post('/register', [
		// Ensure First Name Is Input
		check('firstName', 'First Name Is Required').not().isEmpty(),
		// Ensure Last Name Is Input
		check('lastName', 'Last Name Is Required').not().isEmpty(),
		//Ensure Email is input
		check('email', "Email Is Required").not().isEmpty().isEmail().custom((value, {req}) =>{
			// check whether email address is already registered
			return new Promise((resolve, reject) =>{
				// search data by email by email in input box
				User.findOne({ email: req.body.email }, function(err, user){
					if(err){
						reject(new Error('Server Error'))
					}
					if(Boolean(user)){
						// if email already exists, throw error 'already registered'
						reject(new Error('Email is already registered'));
					}
					resolve(true)
				})
			})
		}),
		// Ensure Username Is Chosen
		check('username', "Username Is Required").not().isEmpty(),
		// Ensure Password Is Chosen
		check('password', "Password Is Required").not().isEmpty(),
		// Ensure confirmPassword matches password
		check('confirmPassword', "You Must Confirm Your Password").not().isEmpty().custom((value, {req})=>{
			if(req.body.password !== req.body.confirmPassword){
				return false;
			}else{
				return true;
			}
		}).withMessage("Passwords Do Not Match")
	
	],

	(req, res)=>{
		console.log(User);
		// initialize array of errors (express-validator)
		const errors = validationResult(req);
				console.log(errors);
		// if errors not empty, render register page and pass errors
		if(!errors.isEmpty()){
			return res.render('register', {data: errors});
		}else{
			let newUser = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password

			});

			// Hash password (bycryptjs) before saving user to database
			bcrypt.genSalt(10, (err, salt)=>{
				bcrypt.hash(newUser.password, salt, function(err, hash){
					// Set Password To Hash
					newUser.password = hash;
					// Save User
					newUser.save()
						.then(user=>{
							res.render('login', { data: {msg:'You Are Now Registered'}});
						})
						.catch(err=> console.log(err))
				})
			})

			// req.flash('success_msg', "You are now Registered and can Log In");
		 	// res.redirect('register')
		}
})

router.post('/login', (req, res)=>{
	
})


module.exports = router;