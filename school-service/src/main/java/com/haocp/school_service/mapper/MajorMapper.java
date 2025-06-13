package com.haocp.school_service.mapper;

import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.entities.Major;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MajorMapper {

    @Mapping(target = "majorName", source = "name")
    Major toMajor(AddMajorRequest request);
    MajorResponse toMajorResponse(Major major);

}
