package com.dungud.new_service.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CommentCreateRequest {
    String userId;
    String content;
    Long newId;
}
