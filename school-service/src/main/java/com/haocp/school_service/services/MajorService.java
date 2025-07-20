package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.AddMajorComboInUniversityRequest;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
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
        Major major = majorRepository.save(majorMapper.toMajor(request));
        return majorMapper
                .toMajorResponse(major);
    }

    Major addMajor(String majorName){
        return majorRepository.save(Major.builder()
                        .majorName(majorName)
                .build());
    }

    public List<MajorResponse> majors() {
        return majorRepository.findAll().stream().map(
                major -> MajorResponse.builder()
                            .majorId(major.getMajorId())
                            .majorName(major.getMajorName())
                            .scoreOverview(null)
                            .combo(null)
                            .build()
        ).toList();
    }

    public MajorResponse getMajor(Long majorId, Long universityId) {
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

        Map<Integer, MajorStandardScoreOverviewResponse> responseMap = new LinkedHashMap<>();
        if (universityId != null) {
            List<StandardScore> standardScores = standardScoreRepository
                    .findStandardScoreByUniversityUniversityIdAndMajorMajorId(universityId, majorId);

            // Group all scores by year in memory
            Map<Integer, List<StandardScore>> scoresByYear = standardScores.stream()
                    .collect(Collectors.groupingBy(score -> score.getStandardScoreId().getYear(),
                            LinkedHashMap::new, // preserve order
                            Collectors.toList()));



            for (Map.Entry<Integer, List<StandardScore>> entry : scoresByYear.entrySet()) {
                Integer year = entry.getKey();
                List<StandardScore> scores = entry.getValue();

                List<MajorStandardScoreDetailResponse> methods = scores.stream()
                        .map(score -> MajorStandardScoreDetailResponse.builder()
                                .type(score.getStandardScoreId().getScoreType())
                                .score(score.getScore())
                                .build())
                        .collect(Collectors.toList());

                responseMap.put(year, MajorStandardScoreOverviewResponse.builder()
                                .year(year)
                        .scoreDetails(methods)
                        .build());
            }
        }

        return MajorResponse.builder()
                .majorId(majorId)
                .majorName(majorRepository.getReferenceById(majorId).getMajorName())
                .scoreOverview(new ArrayList<>(responseMap.values()))
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
        return buildMajorComboResponse(request.getUniversityId(), request.getMajorId(), request.getCodeCombinations());
    }

    @Transactional
    MajorComboResponse buildMajorComboResponse(long uniId, long majorId, List<String> codeCombinations){
        UniversityMajor universityMajor = universityMajorRepository.findById(UniversityMajorId.builder()
                        .universityId(uniId)
                        .majorId(majorId).build())
                .orElse(universityMajorRepository.save(UniversityMajor.builder()
                        .id(UniversityMajorId.builder()
                                .universityId(uniId)
                                .majorId(majorId)
                                .build())
                        .major(majorRepository.getReferenceById(majorId))
                        .university(uniRepository.getReferenceById(uniId))
                        .build()));
        List<MajorCombo> majorCombos = majorComboBuilder(universityMajor, codeCombinations);
        return MajorComboResponse.builder()
                .universityName(universityMajor.getUniversity().getUniversityName())
                .majorName(universityMajor.getMajor().getMajorName())
                .codeCombination(majorCombos.stream()
                        .map(mc -> mc.getSubjectCombination().getCodeCombination())
                        .toList())
                .build();
    }

    public List<MajorResponse> getMajorByUni(Long universityId) {
        List<UniversityMajor> universityMajors = universityMajorRepository.findByUniversityUniversityId(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));

        return universityMajors.stream()
                .map(um -> getMajor(um.getMajor().getMajorId(), universityId))
                .toList();
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
                            .scoreType(request.getType())
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

    @Transactional
    List<MajorCombo> majorComboBuilder(UniversityMajor universityMajor, List<String> comboNames) {
        List<MajorCombo> majorCombos = comboNames.stream()
                .map(comboName -> MajorCombo.builder()
                        .majorComboId(MajorComboId.builder()
                                .majorId(universityMajor.getMajor().getMajorId())
                                .universityId(universityMajor.getUniversity().getUniversityId())
                                .codeCombination(comboName)
                                .build())
                        .major(universityMajor.getMajor())
                        .university(universityMajor.getUniversity())
                        .subjectCombination(subjectCombinationRepository.getReferenceById(comboName))
                        .build())
                .toList();
        return majorComboRepository.saveAll(majorCombos);
    }

    UniversityMajorResponse getUniversityMajor(UniversityMajorId id) {
        return UniversityMajorResponse.builder()
                .majorName(majorRepository.getReferenceById(id.getMajorId())
                        .getMajorName())
                .universityName(uniRepository.getReferenceById(id.getUniversityId())
                        .getUniversityName())
                .build();
    }

    @Transactional
    public MajorComboResponse addMajorsInUniversity(Long universityId, AddMajorComboInUniversityRequest request) {
        Major major = majorRepository.findByMajorName(request.getMajorName());
        if (major == null) {
            major = addMajor(request.getMajorName());
        }
        return buildMajorComboResponse(universityId, major.getMajorId(), request.getCodeCombinations());
    }
}
