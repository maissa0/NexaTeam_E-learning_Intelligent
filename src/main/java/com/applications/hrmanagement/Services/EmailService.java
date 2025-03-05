package com.applications.hrmanagement.Services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.apache.commons.validator.routines.EmailValidator;



@Service
public class EmailService implements IEmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendEmail(String to, String subject, String name) {
        // Valider l'adresse e-mail
        if (!isValidEmail(to)) {
            throw new IllegalArgumentException("Invalid 'to' email address: " + to);
        }

        // Créer un contexte Thymeleaf pour remplir le template
        Context context = new Context();
        context.setVariable("name", name); // Nom du candidat

        // Générer le contenu HTML à partir du template
        String htmlContent = templateEngine.process("email-template", context);

        // Créer et configurer le message MIME
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        try {
            helper.setFrom("pidevlearn1@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true pour indiquer que le contenu est HTML
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }

        // Envoyer l'e-mail
        mailSender.send(mimeMessage);
    }

    // Méthode pour valider les adresses e-mail
    private boolean isValidEmail(String email) {
        return EmailValidator.getInstance().isValid(email);
    }


}