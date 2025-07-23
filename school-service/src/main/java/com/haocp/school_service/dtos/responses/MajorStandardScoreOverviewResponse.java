package com.haocp.school_service.dtos.responses;

import com.haocp.school_service.entities.enums.ScoreType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MajorStandardScoreOverviewResponse {

    int year;
    List<MajorStandardScoreDetailResponse> scoreDetails;

}
