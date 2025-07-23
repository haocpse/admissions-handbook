package com.haocp.school_service.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MajorResponse {

    long majorId;
    String majorCode;
    String majorName;
    int totalUni;
    List<MajorStandardScoreOverviewResponse> scoreOverview;
    List<SubjectCombinationResponse> combo;

}
