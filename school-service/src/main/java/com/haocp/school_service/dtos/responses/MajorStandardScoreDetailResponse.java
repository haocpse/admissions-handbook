package com.haocp.school_service.dtos.responses;

import com.haocp.school_service.entities.enums.ScoreType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MajorStandardScoreDetailResponse {

    ScoreType type;
    double score;

}
