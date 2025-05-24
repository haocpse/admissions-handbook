package com.haocp.school_service.dtos.requests;

import com.haocp.school_service.entities.UniversityMajorId;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AddStandardScoreRequest {

    UniversityMajorId UniversityMajorId;
    int year;
    double score;

}
