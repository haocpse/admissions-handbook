package com.dungud.new_service.dtos.responses;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CommentDetailResponse {
    Long commentId;
    String userId;
    Long parentCommentId;
    String content;
    LocalDateTime createAt;
}
