const sendCalculationEmail = async (toEmail, calculationData, type = 'mortgage') => {
    console.log('Sending email to:', toEmail, 'type:', type);
    try {
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
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};