package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.AddMajorComboRequest;
import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.requests.AddStandardScoreRequest;
import com.haocp.school_service.dtos.responses.*;
import com.haocp.school_service.entities.*;
import com.haocp.school_service.entities.enums.UniMain;
import com.haocp.school_service.mapper.MajorMapper;
import com.haocp.school_service.repositories.*;
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
public class MajorService {

    @Autowired
    MajorRepository majorRepository;
    @Autowired
    MajorMapper majorMapper;
    @Autowired
    StandardScoreRepository standardScoreRepository;
    @Autowired
    UniversityMajorRepository universityMajorRepository;
    @Autowired
    UniRepository uniRepository;
    @Autowired
    SubjectCombinationRepository subjectCombinationRepository;

    @Transactional
    public List<MajorResponse> getNameMajor(List<Long> ids){
        return ids.stream()
                .map(id -> majorRepository.findById(id)
                        .map(major ->MajorResponse.builder()
                                .majorName(major.getMajorName())
                                .build())
                        .orElseThrow(() -> new RuntimeException("Major not found")))
                .toList();
    }

    public MajorResponse addMajor(AddMajorRequest request){
        return majorMapper
                .toMajorResponse(majorRepository
                        .save(majorMapper.toMajor(request)));
    }

    @Transactional
    public List<MajorResponse> importMajorByCSV(MultipartFile file) {
        List<MajorResponse> responses = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVReader csvReader = new CSVReader(reader)) {
            String[] line;
            csvReader.readNext();
            while ((line = csvReader.readNext()) != null) {
                String name = line[0].trim();
                Major major = majorRepository.save(Major.builder()
                        .majorName(name)
                        .build());
                responses.add(MajorResponse.builder()
                                .majorName(major.getMajorName())
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }
        return responses;
    }

    @Transactional
    public StandardScoreResponse addStandardScore(AddStandardScoreRequest request) {
        UniversityMajor universityMajor = universityMajorRepository.findById(
                UniversityMajorId.builder()
                        .majorId(request.getMajorId())
                        .universityId(request.getUniversityId())
                        .build()
        ).orElseThrow(() -> new RuntimeException("University major doesn't exist"));


        StandardScore standardScore = standardScoreRepository.save(StandardScore.builder()
                .standardScoreId(StandardScoreId.builder()
                        .universityMajorId(
                                UniversityMajorId.builder()
                                        .majorId(request.getMajorId())
                                        .universityId(request.getUniversityId())
                                        .build()
                        )
                        .year(request.getYear())
                        .build())
                        .universityMajor(universityMajor)
                .score(request.getScore())
                .build());

        return StandardScoreResponse.builder()
                .universityMajor(getUniversityMajor(standardScore.getStandardScoreId().getUniversityMajorId()))
                .year(standardScore.getStandardScoreId().getYear())
                .score(standardScore.getScore())
                .build();
    }

    @Transactional
    public List<StandardScoreResponse> importScoreByCSV(MultipartFile file){
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
                        .universityMajor(getUniversityMajor(standardScore.getStandardScoreId().getUniversityMajorId()))
                        .year(standardScore.getStandardScoreId().getYear())
                        .score(standardScore.getScore())
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }
        return responses;
    }

    public MajorComboResponse addMajorCombo(AddMajorComboRequest request) {
        Major major = majorRepository.findById(request.getMajorId()).orElseThrow(
                () -> new RuntimeException("Major doesn't exist"));
        List<SubjectCombination> subjectCombinations = getListSubjectCombination(request.getCodeCombinations());
        major.setSubjectCombinations(subjectCombinations);
        majorRepository.save(major);
        return MajorComboResponse.builder()
                .majorName(major.getMajorName())
                .codeCombination(major.getSubjectCombinations().stream().map(SubjectCombination::getCodeCombination).toList())
                .build();
    }

    UniversityMajorResponse getUniversityMajor(UniversityMajorId id) {
        return UniversityMajorResponse.builder()
                .majorName(majorRepository.getReferenceById(id.getMajorId())
                        .getMajorName())
                .universityName(uniRepository.getReferenceById(id.getUniversityId())
                        .getUniversityName())
                .build();
    }

    List<SubjectCombination> getListSubjectCombination(List<String> codeCombinations) {
        return codeCombinations.stream()
                .map(id -> subjectCombinationRepository.getReferenceById(id))
                .toList();
    }

}
