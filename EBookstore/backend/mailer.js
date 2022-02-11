require('dotenv');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async(to, subject, html) => {
    await transport.sendMail({
        from: '"MUPS Team" ' + process.env.EMAIL_USER,
        to,
        subject,
        html
    });
};

module.exports = { sendEmail };