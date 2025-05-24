package com.haocp.school_service.services;

import com.haocp.school_service.dtos.responses.UniversityMajorResponse;
import com.haocp.school_service.entities.UniversityMajor;
import com.haocp.school_service.entities.UniversityMajorId;
import com.haocp.school_service.repositories.MajorRepository;
import com.haocp.school_service.repositories.UniRepository;
import com.haocp.school_service.repositories.UniversityMajorRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UniversityMajorService {

    @Autowired
    UniversityMajorRepository universityMajorRepository;
    @Autowired
    UniRepository uniRepository;
    @Autowired
    MajorRepository majorRepository;

    @Transactional
    public void addUniversityMajor(long universityId, List<Long> majorId ) {

    }

    @Transactional
    public UniversityMajorResponse getUniversityMajor(UniversityMajorId id) {
        return UniversityMajorResponse.builder()
                .majorName(majorRepository.getReferenceById(id.getMajorId())
                        .getMajorName())
                .universityName(uniRepository.getReferenceById(id.getUniversityId())
                        .getUniversityName())
                .build();
    }



}
