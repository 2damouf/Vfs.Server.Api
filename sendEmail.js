const nodemailer = require('nodemailer');

const sendEmail = (recipient, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    const mailOptions = {
        from: '',
        to: recipient,
        subject: 'PolBot Panel Şifre Bilgilendirme',
        text: `Merhaba Yeni Şifreniz: ${text} olarak güncellenmiştir. Yeni şifrenizi kullnarak giriş yapabilirsiniz.`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('E-posta gönderildi: ' + info.response);
        }
    });
};

module.exports = sendEmail;