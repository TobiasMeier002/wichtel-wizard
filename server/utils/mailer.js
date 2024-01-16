require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false
});

const sendConfirmationEmail = (toEmail) => {
  console.log('send mail', toEmail, process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Account Confirmation',
    text: 'Thank you for registering! Your account has been successfully created.',
    html: '<p>Thank you for registering! Your account has been successfully created.</p>' // You can use HTML content
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
  sendConfirmationEmail
};
