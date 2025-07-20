package com.dungud.noti_service.services;

import com.dungud.noti_service.dtos.requests.NotiRequest;

public interface NotificationService {
    void sendNotification(NotiRequest request);
}
