package com.haocp.auth_service.dtos.responses;

import com.haocp.auth_service.dtos.enums.UniMain;
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
