package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.AddSubjectRequest;
import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.SubjectResponse;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.Major;
import com.haocp.school_service.entities.Subject;
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
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectService {

    @Autowired
    SubjectRepository subjectRepository;

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

    public List<SubjectResponse> importCSV(MultipartFile file){
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

}
