package com.haocp.school_service.dtos.requests;

import com.haocp.school_service.entities.enums.ScoreType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateStandardScoreRequest {

    long universityId;
    long majorId;
    int year;
    double score;
    ScoreType type;

}
