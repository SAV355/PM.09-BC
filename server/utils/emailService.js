const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'undefined');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,  
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Проверка подключения к email
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email connection error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Функция для генерации HTML шаблона письма
const generateEmailTemplate = (data, type) => {
  const currentDate = new Date().toLocaleString('ru-RU');
  const titles = {
    mortgage: { name: 'Ипотека', color: '#1E3A8A' },
    auto: { name: 'Автокредит', color: '#10B981' },
    consumer: { name: 'Потребительский кредит', color: '#8B5CF6' },
    pension: { name: 'Пенсионные накопления', color: '#F59E0B' },
  };
  const current = titles[type] || titles.mortgage;

  // Безопасное получение параметров и результатов
  const parameters = data?.parameters || {};
  const results = data?.results || {};

  // Функция для построения таблицы
  const buildTable = (obj) => {
    if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) {
      return '<p>Нет данных</p>';
    }
    let rows = '';
    for (const [key, value] of Object.entries(obj)) {
      // Экранируем HTML-символы, чтобы избежать XSS и поломки
      const safeKey = String(key).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
      const safeValue = String(value).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
      rows += `<tr><td style="padding: 8px; border: 1px solid #ddd;">${safeKey}</td><td style="padding: 8px; border: 1px solid #ddd;">${safeValue}</td></tr>`;
    }
    return `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">${rows}</table>`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Результаты расчёта ${current.name}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${current.color}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: ${current.color}; color: white; }
        .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${current.name}</h1>
        <p>Банковский калькулятор</p>
      </div>
      <div class="content">
        <p>Дата расчёта: ${currentDate}</p>
        <h2>Параметры расчёта</h2>
        ${buildTable(parameters)}
        <h2>Результаты расчёта</h2>
        ${buildTable(results)}
        <p>Данный расчёт является предварительным. Для получения точных условий обратитесь в банк.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Банковский калькулятор
      </div>
    </body>
    </html>
  `;
};

// Функция отправки email
const sendCalculationEmail = async (toEmail, calculationData, type = 'mortgage') => {
  console.log('Sending email to:', toEmail, 'type:', type);
  try {
    // Проверяем, что calculationData существует
    if (!calculationData) {
      console.error('calculationData is missing');
      return { success: false, error: 'Нет данных для письма' };
    }
    const htmlContent = generateEmailTemplate(calculationData, type);
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const mailOptions = {
      from: `"Банковский калькулятор" <${fromEmail}>`,
      to: toEmail,
      subject: `Результаты расчёта (${type}) - Банковский калькулятор`,
      html: htmlContent,
      text: `Результаты расчёта ${type}.\nПожалуйста, используйте почтовый клиент, поддерживающий HTML.`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent, messageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error in sendCalculationEmail:', error);
    return { success: false, error: error.message };
  }
};

// Функция для сохранения логов отправки email (упрощенная версия)
const saveEmailLog = async (logData) => {
    // В дальнейшем возможна реализую здесь запись в базу данных
    console.log('Email log:', logData);
    return true;
};

// Функция для отправки уведомления администратору
const sendAdminNotification = async (subject, message) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_ADMIN,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return false;
    }
};

module.exports = { sendCalculationEmail, sendAdminNotification, transporter };