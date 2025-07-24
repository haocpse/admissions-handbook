package com.haocp.school_service.dtos.responses;

import com.haocp.school_service.entities.UniversityMajor;
import com.haocp.school_service.entities.enums.UniMain;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UniversityResponse {

    long universityId;
    String universityName;
    String code;
    String address;
    String thumbnail;
    UniMain main;
    double pointRating;
    List<MajorResponse> universityMajors;

}
