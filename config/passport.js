const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = function(passport){
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done)=>{
			// Match User to email
			User.findOne({ email: email})
			.then(user =>{
				// Match Email To DB
				if(!user){
					return done(null, false, { message: 'Incorrect Email'} );
				}
				// Match Password To Email In DB
				bcrypt.compare(password, user.password, (err, isMatch)=>{
					if(err) throw err;
					if(isMatch){
						return done(null, user)
					}else{
						return done(null, false, { message: 'Incorrect Password' });
					}
				})
			
			})
			.catch(err => console.log(err))
		})	
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		})
	})

	
	
}













