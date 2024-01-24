require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false
});

const sendConfirmationEmail = (user) => {
  console.log('send register mail', user.email, process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Account Confirmation',
    text: `Thank you for registering! Your account has been successfully created. Please confirm your E-Mail with this Link: https://localhost:3000/confirm/${user.confirmUri}`,
    html: `<p>Thank you for registering! Your account has been successfully created.</p><p><a href="https://localhost:3000/confirm/${user.confirmUri}">Please confirm your E-Mail<a>` // You can use HTML content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
const sendInvitationEmail = (user) => {
  console.log('send invitation mail', user.email, process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Account Confirmation',
    text: `You have been invited to the Wichtel Wizard! Your account needs to be created. Please create your Account with this Link: https://localhost:3000/confirm/${user.confirmUri}`,
    html: `<p>You have been invited to the Wichtel Wizard! Your account needs to be created.</p><p><a href="https://localhost:3000/confirm/${user.confirmUri}">Please create your Account<a>` // You can use HTML content
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
  sendInvitationEmail
};
