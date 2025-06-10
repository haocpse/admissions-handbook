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
import java.util.Map;
import java.util.stream.Collectors;

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
    @Autowired
    MajorComboRepository majorComboRepository;

    public MajorResponse addMajor(AddMajorRequest request){
        return majorMapper
                .toMajorResponse(majorRepository
                        .save(majorMapper.toMajor(request)));
    }

    public List<MajorResponse> majors() {
        return majorRepository.findAll().stream().map(
                major -> MajorResponse.builder()
                            .majorName(major.getMajorName())
                            .combo(null)
                            .build()
        ).toList();
    }

    public MajorResponse getMajor(Long majorId) {
        List<MajorCombo> majorCombos = majorComboRepository.findMajorComboByMajorMajorId(majorId)
                .orElseThrow(() -> new RuntimeException("No subject combinations found for major ID: " + majorId));

        List<String> comboCodes = majorCombos.stream()
                .map(mc -> mc.getSubjectCombination().getCodeCombination())
                .toList();

        List<SubjectCombination> subjectCombinations = subjectCombinationRepository.findAllById(comboCodes);
        Map<String, SubjectCombination> comboMap = subjectCombinations.stream()
                .collect(Collectors.toMap(SubjectCombination::getCodeCombination, sc -> sc));

        List<SubjectCombinationResponse> comboResponses = comboCodes.stream()
                .map(code -> {
                    SubjectCombination sc = comboMap.get(code);
                    if (sc == null) throw new RuntimeException("Subject combination not found: " + code);
                    return SubjectCombinationResponse.builder()
                            .codeCombination(sc.getCodeCombination())
                            .subjectName(sc.getComboSubjects().stream()
                                    .map(cs -> cs.getSubject().getSubjectName())
                                    .toList())
                            .build();
                })
                .toList();

        return MajorResponse.builder()
                .majorName(majorRepository.getReferenceById(majorId).getMajorName())
                .combo(comboResponses)
                .build();
    }

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

    @Transactional
    public MajorComboResponse addMajorCombo(AddMajorComboRequest request) {
        Major major = majorRepository.getReferenceById(request.getMajorId());
        List<MajorCombo> majorCombos = majorComboBuilder(major.getMajorId(), request.getCodeCombinations());
        return MajorComboResponse.builder()
                .majorName(major.getMajorName())
                .codeCombination(majorCombos.stream()
                        .map(mc -> mc.getSubjectCombination().getCodeCombination())
                        .toList())
                .build();
    }

    @Transactional
    List<MajorCombo> majorComboBuilder(long majorId, List<String> comboNames) {
        List<MajorCombo> majorCombos = comboNames.stream()
                .map(comboName -> MajorCombo.builder()
                        .majorComboId(MajorComboId.builder()
                                .majorId(majorId)
                                .codeCombination(comboName)
                                .build())
                        .major(majorRepository.getReferenceById(majorId))
                        .subjectCombination(subjectCombinationRepository.getReferenceById(comboName))
                        .build())
                .toList();
        return majorComboRepository.saveAll(majorCombos);
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
                            .majorId(request.getMajorId())
                            .universityId(request.getUniversityId())
                            .year(request.getYear())
                            .build())
                        .university(uniRepository.getReferenceById(request.getUniversityId()))
                        .major(majorRepository.getReferenceById(request.getMajorId()))
                .score(request.getScore())
                .build());

        return StandardScoreResponse.builder()
                .universityMajor(getUniversityMajor(universityMajor.getId()))
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
                                    .majorId(Long.parseLong(majorId))
                                    .universityId(Long.parseLong(uniId))
                                    .year(Integer.parseInt(year))
                                .build())
                        .score(Double.parseDouble(score))
                        .build());
                UniversityMajor universityMajor = universityMajorRepository.findById(
                        UniversityMajorId.builder()
                                .majorId(standardScore.getMajor().getMajorId())
                                .universityId(standardScore.getUniversity().getUniversityId())
                                .build()
                ).orElseThrow(() -> new RuntimeException("University major doesn't exist"));
                responses.add(StandardScoreResponse.builder()
                                .universityMajor(getUniversityMajor(universityMajor.getId()))
                                .year(standardScore.getStandardScoreId().getYear())
                                .score(standardScore.getScore())
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }
        return responses;
    }

    UniversityMajorResponse getUniversityMajor(UniversityMajorId id) {
        return UniversityMajorResponse.builder()
                .majorName(majorRepository.getReferenceById(id.getMajorId())
                        .getMajorName())
                .universityName(uniRepository.getReferenceById(id.getUniversityId())
                        .getUniversityName())
                .build();
    }

}
