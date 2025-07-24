package com.haocp.school_service.dtos.responses;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StandardScoreResponse {

    UniversityMajorResponse universityMajor;
    int year;
    double score;

}
