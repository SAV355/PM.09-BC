const nodemailer = require('nodemailer');
// require('dotenv').config();

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
    const templates = {
        mortgage: {
            subject: 'Результаты расчета ипотеки - Банковский калькулятор',
            title: 'Расчет ипотечного кредита'
        },
        auto: {
            subject: 'Результаты расчета автокредита - Банковский калькулятор',
            title: 'Расчет автокредита'
        },
        consumer: {
            subject: 'Результаты расчета потребительского кредита - Банковский калькулятор',
            title: 'Расчет потребительского кредита'
        },
        pension: {
            subject: 'Результаты расчета пенсионных накоплений - Банковский калькулятор',
            title: 'Расчет пенсионных накоплений'
        }
    };

    const template = templates[type] || templates.mortgage;

    // Убрана неиспользуемая функция formatCurrency внутри generateEmailTemplate
    // Форматирование валюты будет происходить на клиенте перед отправкой

    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${template.subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1E3A8A;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 0 0 10px 10px;
        }
        .result-card {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          margin: 10px 0;
        }
        .result-value {
          font-size: 24px;
          font-weight: bold;
          color: #1E3A8A;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${template.title}</h1>
        <p>Банковский калькулятор</p>
      </div>
      
      <div class="content">
        <p>Уважаемый пользователь,</p>
        <p>Вы запрашивали расчет ${template.title.toLowerCase()}. Ниже представлены результаты:</p>
        
        <div class="result-card">
          <h3>Основные параметры:</h3>
          <table>
            ${Object.entries(data.parameters || {}).map(([key, value]) => `
              <tr>
                <td><strong>${key}</strong></td>
                <td>${value}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="result-card">
          <h3>Результаты расчета:</h3>
          <table>
            ${Object.entries(data.results || {}).map(([key, value]) => `
              <tr>
                <td><strong>${key}</strong></td>
                <td class="result-value">${value}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <p>Данный расчет является предварительным. Для получения точных условий кредита обращайтесь в отделение банка.</p>
        
        <div class="footer">
          <p>Это письмо сформировано автоматически. Пожалуйста, не отвечайте на него.</p>
          <p>© ${new Date().getFullYear()} Банковский калькулятор. Все права защищены.</p>
          <p>Контакты: ${process.env.EMAIL_ADMIN || 'support@bank-calculator.ru'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Функция отправки email
const sendCalculationEmail = async (toEmail, calculationData, type = 'mortgage') => {
  console.log('Sending email to:', toEmail, 'type:', type);
  try {
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const mailOptions = {
      from: `"Банковский калькулятор" <${fromEmail}>`,
      to: toEmail,
      subject: `Результаты расчёта (${type})`,
      text: 'Ваш расчёт выполнен. Результаты во вложении. (Полноценный HTML-шаблон будет добавлен позже)',
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent, messageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
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