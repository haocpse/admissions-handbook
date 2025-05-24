package com.haocp.school_service.services;

import com.haocp.school_service.entities.UniversityMajor;
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

    @Transactional
    public void addUniversityMajor(long universityId, List<Long> majorId ) {

    }


}
