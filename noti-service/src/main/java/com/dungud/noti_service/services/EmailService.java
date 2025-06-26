package com.dungud.noti_service.services;

import com.dungud.noti_service.dtos.requests.EmailRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.time.LocalDate;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String link = "https://www.facebook.com/DinhDung.554/";
    private final File logo = new File("src/main/resources/pictures/logo.jpg");

    public void sendInsertMajorEmail(String schoolName, EmailRequest request) {
        Context context = new Context();
        context.setVariable("schoolName", schoolName);
        context.setVariable("link", link); // Truyền thêm đường dẫn vào template

        String html = templateEngine.process("Insert_Major", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getEmail());
            helper.setSubject("Trường " + schoolName + " thêm ngành học mới");
            helper.setText(html, true);

            helper.addInline("logoImage", logo);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại tới " + request.getEmail(), e);
        }
    }

    public void sendUpdateScoreEmail(String schoolName, EmailRequest request) {
        Context context = new Context();
        context.setVariable("schoolName", schoolName);
        context.setVariable("year", LocalDate.now().getYear());
        context.setVariable("link", link);

        String html = templateEngine.process("Update_Score", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getEmail());
            helper.setSubject("Trường " + schoolName + " cập nhật điểm chuẩn");
            helper.setText(html, true);

            helper.addInline("logoImage", logo);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại tới " + request.getEmail(), e);
        }
    }


    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại tới " + to, e);
        }
    }
}
