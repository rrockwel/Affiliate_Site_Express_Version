let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');


// Set Schema
const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: false
	},
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	}
});


let User = module.exports = mongoose.model('User', UserSchema);


