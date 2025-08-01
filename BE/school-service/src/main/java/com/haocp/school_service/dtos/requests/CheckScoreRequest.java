package com.haocp.school_service.dtos.requests;

import com.haocp.school_service.entities.enums.ScoreType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CheckScoreRequest {

    double score;
    ScoreType scoreType;

}
