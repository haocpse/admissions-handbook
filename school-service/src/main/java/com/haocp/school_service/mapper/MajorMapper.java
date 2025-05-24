package com.haocp.school_service.mapper;

import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.entities.Major;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MajorMapper {

    Major toMajor(AddMajorRequest request);
    MajorResponse toMajorResponse(Major major);

}
