const { text } = require('express');
const nodemailer = require('nodemailer');

// 1. Данные из формы или отдельной графы
const senderEmail = 'svarogarotmir355@gmail.com'; // Email отправителя
const applicationPass = 'your-app-password'; // Специальный пароль для сторонних приложений
const recipientEmail = 'user-input@gmail.com'; // Email получателя
const textReport = 'если уписьмо видишь это письмо, SMTP работает, и это круто.';


// 2. Настройка конфигурации почтового сервера (на примере Gmail)
nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'svarogarotmir355@gmail.com', // Тестовый логин
            pass: 'flpd yuzq skrf cvsr'  // Тестовый пароль
        }
    });


    // 3. Формирование письма
    const mailOptions = {
        from: 'svarogarotmir355@gmail.com',
        to: 'sofronov.anton.sav@gmail.com',
        subject: 'Ежемесячный отчет',
        text: 'если уписьмо видишь это письмо, SMTP работает, и это круто.'
    };


    // 4. Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log('Письмо отправлено!');
        // Ссылка на просмотр отправленного письма в браузере:
        console.log('Ссылка для просмотра письма: %s', nodemailer.getTestMessageUrl(info));
    });
});