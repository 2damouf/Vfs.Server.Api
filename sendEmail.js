const nodemailer = require('nodemailer');
const mailAdress = '';
const password = '';
const sendEmail = (recipient, newPassword) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailAdress,
            pass: password
        }
    });

    const mailOptions = {
        from: mailAdress,
        to: recipient,
        subject: 'PolBot Panel Şifre Bilgilendirme',
        text: `Merhaba Yeni Şifreniz: ${newPassword} olarak güncellenmiştir. Yeni şifrenizi kullnarak giriş yapabilirsiniz.`
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