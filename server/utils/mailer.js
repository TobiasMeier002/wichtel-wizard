require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false
});

//Create and send E-Mail Confirmation Mail
const sendConfirmationEmail = (user) => {
  console.log('send register mail', user.email, process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Account Confirmation',
    text: `Thank you for registering! Your account has been successfully created. Please confirm your E-Mail with this Link: http://localhost:8000/api/confirm/${user.confirmUri}`,
    html: `<p>Thank you for registering! Your account has been successfully created.</p><p><a href="http://localhost:8000/api/confirm/${user.confirmUri}">Please confirm your E-Mail<a>` // You can use HTML content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

//Create and send Invitaion Mail, will be used, if a participant has no user
const sendInvitationEmail = (user) => {
  console.log('send invitation mail', user.email, process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Account Invitation',
    text: `You have been invited to the Wichtel Wizard! Your account needs to be created. Please create your Account with this Link: http://localhost:3000/confirm/${user.email}/${user.confirmUri}`,
    html: `<p>You have been invited to the Wichtel Wizard! Your account needs to be created.</p><p><a href="http://localhost:3000/confirm/${user.email}/${user.confirmUri}">Please create your Account<a>` // You can use HTML content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

//Create and send Invitation to Event Mail
const sendInvitationtoEventEmail = (user, eventname, participantid) => {
  console.log('send Event invitation mail', user.email, process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Wichtel Wizard Event Invitation',
    text: `You have been invited to the Event ${eventname}! Please confirm your participation with this Link: http://localhost:8000/api/participant/${participantid}/confirm or decline it with this Link http://localhost:8000/api/participant/${participantid}/decline`,
    html: `<p>You have been invited to the Event ${eventname}!</p><p><a href="http://localhost:8000/api/participant/${participantid}/confirm">Accept Invitation</a><br><a href="http://localhost:8000/api/participant/${participantid}/decline">Decline Invitation</a>` // You can use HTML content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendConfirmationEmail,
  sendInvitationEmail,
  sendInvitationtoEventEmail
};
