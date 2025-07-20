package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.AddSubjectCombinationRequest;
import com.haocp.school_service.dtos.requests.AddSubjectRequest;
import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.SubjectCombinationResponse;
import com.haocp.school_service.dtos.responses.SubjectResponse;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.*;
import com.haocp.school_service.repositories.ComboSubjectRepository;
import com.haocp.school_service.repositories.SubjectCombinationRepository;
import com.haocp.school_service.repositories.SubjectRepository;
import com.opencsv.CSVReader;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectService {

    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    SubjectCombinationRepository subjectCombinationRepository;
    @Autowired
    ComboSubjectRepository comboSubjectRepository;

    @Transactional
    public SubjectResponse addSubject(AddSubjectRequest request) {
        return SubjectResponse.builder()
                .subjectName(subjectRepository
                        .save(Subject.builder()
                                .subjectName(request.getSubjectName())
                                .build())
                        .getSubjectName())
                .build();
    }

    public List<SubjectResponse> subjects() {
        return subjectRepository.findAll().stream().map(
                subject ->
                        SubjectResponse.builder()
                                .subjectName(subject.getSubjectName())
                                .build()
        ).toList();
    }

    public List<SubjectCombinationResponse> comboSubjects() {
        List<SubjectCombinationResponse> responses = new ArrayList<>();
        List<SubjectCombination> subjectCombinations = subjectCombinationRepository.findAll();
        for (SubjectCombination subjectCombination : subjectCombinations) {
            responses.add(getComboSubject(subjectCombination.getCodeCombination()));
        }
        return responses;
    }

    public SubjectCombinationResponse getComboSubject(String codeCombination) {
        List<ComboSubject> comboSubjects = comboSubjectRepository.findBySubjectCombinationCodeCombination(codeCombination)
                .orElseThrow(() -> new RuntimeException("Error at getComboSubject"));
        return SubjectCombinationResponse.builder()
                .codeCombination(codeCombination)
                .subjectName(comboSubjects.stream()
                        .map(
                                comboSubject -> comboSubject.getSubject().getSubjectName()
                        )
                        .toList())
                .build();
    }

    @Transactional
    public SubjectCombinationResponse addSubjectCombination(AddSubjectCombinationRequest request) {
        SubjectCombination subjectCombination = subjectCombinationRepository.save(
                SubjectCombination.builder()
                        .codeCombination(request.getCodeCombination())
                        .build()
        );

        List<ComboSubject> comboSubjects = majorComboBuilder(subjectCombination.getCodeCombination(), request.getSubjectIds());

        return SubjectCombinationResponse.builder()
                .codeCombination(subjectCombination.getCodeCombination())
                .subjectName(comboSubjects.stream()
                        .map(cs -> cs.getSubject().getSubjectName())
                        .toList())
                .build();
    }

    @Transactional
    public List<SubjectResponse> importSubjectByCSV(MultipartFile file){
        List<SubjectResponse> responses = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVReader csvReader = new CSVReader(reader)) {
            String[] line;
            csvReader.readNext();
            while ((line = csvReader.readNext()) != null) {
                String name = line[0].trim();
                Subject subject = subjectRepository.save(Subject.builder()
                        .subjectName(name)
                        .build());
                responses.add(SubjectResponse.builder()
                        .subjectName(subject.getSubjectName())
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }
        return responses;
    }

//    @Transactional
//    public List<SubjectCombinationResponse> importComboByCSV(MultipartFile file){
//        List<SubjectCombinationResponse> responses = new ArrayList<>();
//        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
//             CSVReader csvReader = new CSVReader(reader)) {
//            String[] line;
//            csvReader.readNext();
//            while ((line = csvReader.readNext()) != null) {
//                String code = line[0].trim();
//                List<String> name = Arrays.stream(line[1].split("\\|"))
//                        .map(String::trim)
//                        .toList();
//                SubjectCombination subjectCombination = subjectCombinationRepository.save(SubjectCombination.builder()
//                        .codeCombination(code)
//                        .subjects(getListSubject(name))
//                        .build());
//                responses.add(SubjectCombinationResponse.builder()
//                        .codeCombination(subjectCombination.getCodeCombination())
//                        .subjectName(subjectCombination.getSubjects().stream().map(Subject::getSubjectName).toList())
//                        .build());
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to parse CSV", e);
//        }
//        return responses;
//    }

    @Transactional
    List<ComboSubject> majorComboBuilder(String comboName, List<Long> subjectIds) {
        List<ComboSubject> comboSubjects = subjectIds.stream()
                .map(subjectId -> ComboSubject.builder()
                        .comboSubjectId(ComboSubjectId.builder()
                                .codeCombination(comboName)
                                .subjectId(subjectId)
                                .build())
                        .subjectCombination(subjectCombinationRepository.getReferenceById(comboName))
                        .subject(subjectRepository.getReferenceById(subjectId))
                        .build())
                .toList();
        return comboSubjectRepository.saveAll(comboSubjects);
    }

}
