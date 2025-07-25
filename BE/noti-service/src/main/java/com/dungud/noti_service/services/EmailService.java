package com.dungud.noti_service.services;

import com.dungud.noti_service.dtos.requests.EmailRequest;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.activation.DataSource;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;


    private DataSource getLogoDataSource() {
        try {
            ClassPathResource resource = new ClassPathResource("pictures/logo.jpg");
            return new ByteArrayDataSource(resource.getInputStream(), "image/jpeg");
        } catch (IOException e) {
            throw new RuntimeException("Không thể đọc file logo.jpg", e);
        }
    }

    public void sendInsertMajorEmail(String schoolName, EmailRequest request, String link) {
        Context context = new Context();
        context.setVariable("schoolName", schoolName);
        context.setVariable("link", link);

        String html = templateEngine.process("Insert_Major", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getEmail());
            helper.setSubject("Trường " + schoolName + " thêm ngành học mới");
            helper.setText(html, true);

            helper.addInline("logoImage", getLogoDataSource());

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại tới " + request.getEmail(), e);
        }
    }

    public void sendUpdateScoreEmail(String schoolName, EmailRequest request, String link) {
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

            helper.addInline("logoImage", getLogoDataSource());

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại tới " + request.getEmail(), e);
        }
    }
}
