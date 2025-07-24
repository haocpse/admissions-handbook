package com.dungud.noti_service.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum NotificationType {
    InsertMajor,
    UpdateScore
}
