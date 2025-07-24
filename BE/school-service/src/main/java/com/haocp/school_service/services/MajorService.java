package com.haocp.school_service.services;

import com.haocp.school_service.dtos.responses.*;
import com.haocp.school_service.dtos.requests.*;
import com.haocp.school_service.entities.enums.ScoreType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MajorService {

    MajorResponse addMajor(AddMajorRequest request);
    List<MajorResponse> majors();
    MajorResponse getMajor(Long majorId, Long universityId);
    List<MajorResponse> getNameMajor(List<Long> ids);
    MajorComboResponse addMajorCombo(AddMajorComboRequest request);
    List<MajorResponse> getMajorByUni(Long universityId);
    List<MajorResponse> importMajorByCSV(MultipartFile file);
    List<StandardScoreResponse> importScoreByCSV(MultipartFile file);
    MajorComboResponse addMajorsInUniversity(Long universityId, AddMajorComboInUniversityRequest request);
    MajorComboResponse updateMajorsInUniversity(Long universityId, UpdateMajorComboInUniversityRequest request);
    StandardScoreResponse updateMajorScore(UpdateStandardScoreRequest request);
    Void deleteMajorScore(Long uniId, Long majorId, int year, ScoreType type);
    MajorResponse deleteMajor(Long majorId);
    MajorResponse updateMajor(Long majorId, UpdateMajorRequest request);
    StandardScoreResponse addStandardScore(AddStandardScoreRequest request);

}
