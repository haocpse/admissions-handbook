package com.haocp.school_service.services;

import com.haocp.school_service.dtos.responses.*;
import com.haocp.school_service.dtos.requests.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SubjectService {

    SubjectResponse addSubject(AddSubjectRequest request);
    List<SubjectResponse> subjects();
    List<SubjectCombinationResponse> comboSubjects();
    SubjectCombinationResponse getComboSubject(String codeCombination);
    SubjectCombinationResponse addSubjectCombination(AddSubjectCombinationRequest request);
    List<SubjectResponse> importSubjectByCSV(MultipartFile file);
    SubjectCombinationResponse deleteComboSubject(String codeCombination);
    SubjectCombinationResponse updateComboSubject(String codeCombination, UpdateComboSubjectRequest request);

}
