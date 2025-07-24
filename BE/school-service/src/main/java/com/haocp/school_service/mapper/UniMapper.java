package com.haocp.school_service.mapper;

import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.requests.UpdateUniversityRequest;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.University;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UniMapper {

    @Mapping(target = "thumbnail", ignore = true )
    University toUniversity(AddUniversityRequest request);

    @Mapping(target = "thumbnail", ignore = true )
    void updateUniversityFromUpdateRequest(UpdateUniversityRequest dto, @MappingTarget University entity);

    @Mapping(target = "universityMajors", ignore = true)
    UniversityResponse toUniversityResponse(University university);

}
