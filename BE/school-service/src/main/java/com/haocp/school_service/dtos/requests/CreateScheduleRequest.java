package com.haocp.school_service.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CreateScheduleRequest {

    String content;
    LocalDateTime startDate;
    LocalDateTime endDate;
    String note;
    boolean mainSchedule;

}
