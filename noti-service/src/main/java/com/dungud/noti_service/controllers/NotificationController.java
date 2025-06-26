package com.dungud.noti_service.controllers;

import com.dungud.noti_service.dtos.requests.NotiRequest;
import com.dungud.noti_service.dtos.responses.ApiResponse;
import com.dungud.noti_service.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/Notifications")
public class NotificationController {
    @Autowired
    NotificationService notificationService;

    @PostMapping("/send")
    public ApiResponse<Void> sendNotification(@RequestBody NotiRequest notiRequest) {
        notificationService.sendNotification(notiRequest);
        return ApiResponse.<Void>builder()
                .message("Notification sent successfully")
                .build();
    }
}
