package com.dungud.noti_service.services;

import com.dungud.noti_service.dtos.requests.NotiRequest;
import com.dungud.noti_service.dtos.requests.NotificationType;
import com.dungud.noti_service.dtos.requests.EmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private EmailService emailService;

    public void sendNotification(NotiRequest request) {
        if(request.getNotificationType() ==  NotificationType.InsertMajor) {
            sendInsertMajorNotification(request.getEmailRequestList(), request.getSchoolName());
        } else if (request.getNotificationType() == NotificationType.UpdateScore) {
                sendUpdateScoreNotification(request.getEmailRequestList(), request.getSchoolName());
        } else {
            throw new IllegalArgumentException("Unknown notification type: " + request.getNotificationType());
        }
    }

    private void sendInsertMajorNotification(List<EmailRequest> requests, String schoolName) {
        for (EmailRequest req : requests) {
            emailService.sendInsertMajorEmail(schoolName, req);
        }
    }

    private void sendUpdateScoreNotification(List<EmailRequest> requests, String schoolName) {
        for (EmailRequest req : requests) {
            emailService.sendUpdateScoreEmail(schoolName, req);
        }
    }
}
