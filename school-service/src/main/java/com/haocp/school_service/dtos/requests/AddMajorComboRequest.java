package com.haocp.school_service.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AddMajorComboRequest {

    Long universityId;
    String codeMajor;
    Long majorId;
    List<String> codeCombinations;

}
