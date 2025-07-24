package com.haocp.school_service.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ScheduleResponse {

    long scheduleId;
    String content;
    LocalDateTime startDate;
    LocalDateTime endDate;
    String note;
    boolean mainSchedule;


}
