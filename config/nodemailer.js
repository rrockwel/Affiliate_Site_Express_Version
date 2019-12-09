const express = require('express');
const nodemailer = require('nodemailer');

module.exports = {
	router.post('/contact', (res,res,next)=>{
		//Instantiate SMTP Server
		const smtpTransport = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: 'vtboarder69@gmail.com',
				pass: 'yjjcirikpzwvmicj'
			}
		})

		// Specify Email Structure
		const mailOpts = {
			from: `${req.body.email}`,
			to: 'vtboarder69@gmail.com',
			subject: 'New Message From Affiliate Contact Form',
			text: `${req.body.firstName} ${req.body.lastName} (${req.body.email}) says: '${req.body.message}'`
		}

		// Attempt To Send Email
		smtpTransport.sendMail(mailOpts, (error, response)=>{
			if(error){
				res.render('contact-failure') // Display Failure Page
				console.log(error)
			}else{
				res.render('contact-success') // Display Success Page
			}
		})
	})
}