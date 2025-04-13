package com.esprit.microservice.paymentmanagement;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPaymentConfirmation(String toEmail, String payerName, double amount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("✅ Payment Confirmation");

            String htmlContent = """
                <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">Hello %s,</h2>
                    <p>We're pleased to let you know that your payment has been successfully processed.</p>
                    
                    <table style="border-collapse: collapse; width: 100%%; margin-top: 10px;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Amount Paid:</td>
                            <td style="padding: 8px;">$%.2f</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Status:</td>
                            <td style="padding: 8px; color: green;">Completed</td>
                        </tr>
                    </table>

                    <p style="margin-top: 20px;">Thank you for your trust! 🙌</p>
                    <p style="font-size: 14px; color: #888;">This is an automated message, please do not reply.</p>
                </body>
                </html>
                """.formatted(payerName, amount);

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();

        }
    }
}

