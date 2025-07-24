package com.haocp.school_service.dtos.requests;

import com.haocp.school_service.entities.UniversityMajor;
import com.haocp.school_service.entities.enums.UniMain;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AddUniversityRequest {

    String universityName;
    String code;
    String address;
    UniMain main;
    MultipartFile thumbnail;

}
