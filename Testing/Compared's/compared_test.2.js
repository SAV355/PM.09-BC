/* закоментировал для теста (поиск почему не отправляется письмо) */
    //     const htmlContent = generateEmailTemplate(calculationData, type);

    //     const mailOptions = {
    //         from: `"Банковский калькулятор" <${process.env.EMAIL_FROM}>`,
    //         to: toEmail,
    //         subject: calculationData.subject || `Результаты расчета - ${type}`,
    //         html: htmlContent,
    //         text: `Результаты расчета ${type}. Проверьте HTML версию письма.`,
    //     };

    //     const info = await transporter.sendMail(mailOptions);

    //     // Логируем успешную отправку
    //     await saveEmailLog({
    //         to: toEmail,
    //         subject: mailOptions.subject,
    //         messageId: info.messageId,
    //         type: type,
    //         status: 'sent',
    //         sentAt: new Date(),
    //     });

    //     return {
    //         success: true,
    //         messageId: info.messageId,
    //         message: 'Email отправлен успешно'
    //     };

    // } catch (error) {
    //     console.error('Error sending email:', error);

    //     // Логируем ошибку
    //     await saveEmailLog({
    //         to: toEmail,
    //         type: type,
    //         status: 'error',
    //         error: error.message,
    //         sentAt: new Date(),
    //     });

    //     return {
    //         success: false,
    //         error: error.message
    //     };