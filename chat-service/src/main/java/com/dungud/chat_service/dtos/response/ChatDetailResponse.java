package com.dungud.chat_service.dtos.response;

import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ChatDetailResponse {
    Long communityChatId;
    String userId;
    String content;
    boolean isPin;
    Long parentCommunityChatId;
    LocalDateTime createAt;
}
