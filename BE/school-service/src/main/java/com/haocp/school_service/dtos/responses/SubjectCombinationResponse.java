package com.haocp.school_service.dtos.responses;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SubjectCombinationResponse {

    String codeCombination;
    int totalMajor;
    List<String> subjectName;

}
