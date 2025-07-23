const nodemailer = require('nodemailer');

const sendEmail= async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'motocredit125@gmail.com',
            pass: 'jxkybkypfontksgl'
        }
    });
    try {
        const mailOptions = {
            from: 'motocredit125@gmail.com',
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    }catch (error) {
        console.log(error);
    }
}
module.exports = sendEmail;
