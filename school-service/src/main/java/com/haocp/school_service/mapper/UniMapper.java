package com.haocp.school_service.mapper;

import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.University;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UniMapper {

    University toUniversity(AddUniversityRequest request);
    UniversityResponse toUniversityResponse(University university);

}
