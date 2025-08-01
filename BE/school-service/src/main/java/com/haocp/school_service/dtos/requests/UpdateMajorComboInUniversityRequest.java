package com.haocp.school_service.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateMajorComboInUniversityRequest {

    String codeMajor;
    String majorName;
    List<String> combos;

}
