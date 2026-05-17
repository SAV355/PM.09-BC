const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if(error) {
        console.error('Ошибка подключения', error);
    } else {
        console.log('Соединение установленно, можно отправлять письма');
        // Тестовая отправка
        transporter.sendMail({
            from: `"Тест" <${process.env.EMAIL_USER}>`,
            to: 'sofronov.anton.sav@gmail.com',
            subject: 'Test smtp',
            text: 'если уписьмо видишь это письмо, SMTP работает',
        }, (err, info) => {
            if (err) console.error('Ошибка отправки:', err);
            else console.log('Письмо отправлено:', info.messageId);
        });
    }
});

