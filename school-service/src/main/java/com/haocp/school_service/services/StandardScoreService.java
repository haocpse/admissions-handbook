package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.AddStandardScoreRequest;
import com.haocp.school_service.dtos.requests.AddSubjectRequest;
import com.haocp.school_service.dtos.responses.StandardScoreResponse;
import com.haocp.school_service.dtos.responses.SubjectResponse;
import com.haocp.school_service.entities.StandardScore;
import com.haocp.school_service.entities.StandardScoreId;
import com.haocp.school_service.entities.Subject;
import com.haocp.school_service.entities.UniversityMajorId;
import com.haocp.school_service.repositories.StandardScoreRepository;
import com.haocp.school_service.repositories.UniversityMajorRepository;
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
public class StandardScoreService {

    @Autowired
    StandardScoreRepository standardScoreRepository;
    @Autowired
    UniversityMajorRepository universityMajorRepository;
    @Autowired
    UniversityMajorService universityMajorService;

    @Transactional
    public StandardScoreResponse addStandardScore(AddStandardScoreRequest request) {
        if(!universityMajorRepository.existsById(request.getUniversityMajorId()))
            throw new RuntimeException("University major doesn't exist");

        StandardScore standardScore = standardScoreRepository.save(StandardScore.builder()
                        .standardScoreId(StandardScoreId.builder()
                                .universityMajorId(request.getUniversityMajorId())
                                .year(request.getYear())
                                .build())
                        .score(request.getScore())
                .build());

        return StandardScoreResponse.builder()
                .universityMajor(universityMajorService.getUniversityMajor(standardScore.getStandardScoreId().getUniversityMajorId()))
                .year(standardScore.getStandardScoreId().getYear())
                .score(standardScore.getScore())
                .build();
    }

    @Transactional
    public List<StandardScoreResponse> importCSV(MultipartFile file){
        List<StandardScoreResponse> responses = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVReader csvReader = new CSVReader(reader)) {
            String[] line;
            csvReader.readNext();
            while ((line = csvReader.readNext()) != null) {
                String uniId = line[0].trim();
                String majorId = line[1].trim();
                String year = line[2].trim();
                String score = line[3].trim();
                StandardScore standardScore = standardScoreRepository.save(StandardScore.builder()
                        .standardScoreId(StandardScoreId.builder()
                                .universityMajorId(UniversityMajorId.builder()
                                        .universityId(Long.parseLong(uniId))
                                        .majorId(Long.parseLong(majorId))
                                        .build())
                                .year(Integer.parseInt(year))
                                .build())
                                .score(Double.parseDouble(score))
                        .build());
                responses.add(StandardScoreResponse.builder()
                            .universityMajor(universityMajorService.getUniversityMajor(standardScore.getStandardScoreId().getUniversityMajorId()))
                            .year(standardScore.getStandardScoreId().getYear())
                            .score(standardScore.getScore())
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }
        return responses;
    }


}
