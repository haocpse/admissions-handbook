package com.haocp.school_service.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CountDateResponse {

    String content;
    LocalDateTime startTime;
    LocalDateTime endTime;

}
