package com.haocp.school_service.services;

import com.haocp.school_service.dtos.responses.*;
import com.haocp.school_service.dtos.requests.*;
import com.haocp.school_service.entities.enums.UniMain;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UniService {

    UniversityResponse getUniversity(Long universityId);
    UniversityResponse addUniversity(AddUniversityRequest request);
    List<UniversityResponse> universities();
    FilteredUniversityOverviewResponse getUniversitiesByCombo(String codeCombination);
    FilteredUniversityOverviewResponse getUniversitiesByScore(CheckScoreRequest request);
    FilteredUniversityOverviewResponse getUniversitiesByMajor(long majorId);
    List<UniversityResponse> importCSV(MultipartFile file);
    UniversityResponse updateMajorsOfUni(UpdateMajorsOfUniRequest request, Long universityId);
    UniversityResponse addFavorites(long universityId, String username);
    FilteredUniversityOverviewResponse getUniversitiesByMain(UniMain main);
    UniversityResponse updateUniversity(Long universityId, UpdateUniversityRequest request);
    List<UniversityResponse> getFavorites(String username);
}
