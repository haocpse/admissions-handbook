package com.dungud.noti_service.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotiRequest {
    List<EmailRequest> emailRequestList;
    NotificationType notificationType;
    String schoolId;
    String schoolName;
}

