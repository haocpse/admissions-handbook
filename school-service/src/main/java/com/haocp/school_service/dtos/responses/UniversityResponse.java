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

    String universityName;
    String code;
    String alias;
    UniMain main;
    List<MajorResponse> universityMajors;

}
