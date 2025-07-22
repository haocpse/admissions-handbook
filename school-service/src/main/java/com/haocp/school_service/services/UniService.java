package com.haocp.school_service.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.requests.CheckScoreRequest;
import com.haocp.school_service.dtos.requests.UpdateMajorsOfUniRequest;
import com.haocp.school_service.dtos.requests.UpdateUniversityRequest;
import com.haocp.school_service.dtos.responses.*;
import com.haocp.school_service.entities.*;
import com.haocp.school_service.entities.enums.ScoreType;
import com.haocp.school_service.entities.enums.UniMain;
import com.haocp.school_service.mapper.UniMapper;
import com.haocp.school_service.repositories.*;
import com.opencsv.CSVReader;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class UniService {

    @Autowired
    UniRepository uniRepository;
    @Autowired
    UniMapper uniMapper;
    @Autowired
    MajorService majorService;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    MajorRepository majorRepository;
    @Autowired
    UniversityMajorRepository universityMajorRepository;
    @Autowired
    MajorComboRepository majorComboRepository;
    @Autowired
    StandardScoreRepository standardScoreRepository;
    @Autowired
    FavoriteUniversityRepository favoriteUniversityRepository;

    @Value("${app.upload.dir}")
    String baseUploadDir;

    public UniversityResponse getUniversity(Long universityId) {
        University university = uniRepository.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found for ID: " + universityId));
        List<UniversityMajor> universityMajors = universityMajorRepository
                .findByUniversityUniversityId(university.getUniversityId()).orElseThrow(() -> new RuntimeException("Error at getUniversity function"));
        List<Long> majorIds = universityMajors.stream()
                .map(um -> um.getMajor().getMajorId())
                .toList();
        UniversityResponse response = uniMapper.toUniversityResponse(university);
        List<MajorResponse> majorResponses = new ArrayList<>();
        for (Long id : majorIds) {
            majorResponses.add(majorService.getMajor(id, universityId));
        }
        response.setUniversityMajors(majorResponses);
        response.setThumbnail("http://localhost:8080/uploads/"+university.getUniversityId()+"/thumbnail/"+university.getThumbnail());
        return response;
    }

    @Transactional
    public UniversityResponse addUniversity(AddUniversityRequest request) {
        log.info("Thumbnail: "+ request.getThumbnail().getOriginalFilename());
        log.info("baseUploadDir: "+ baseUploadDir);
        String fileName = Objects.requireNonNull(request.getThumbnail().getOriginalFilename()).replace(" ", "_");
        University university = uniMapper.toUniversity(request);
        university.setThumbnail(fileName);
        university.setActive(true);
        University savedUniversity = uniRepository.save(university);
        saveThumbnail(request.getThumbnail(), savedUniversity.getUniversityId());
//        addUniversityMajor(savedUniversity.getUniversityId(), request.getMajorIds());
        UniversityResponse response = uniMapper.toUniversityResponse(savedUniversity);
//        response.setUniversityMajors(majorService.getNameMajor(request.getMajorIds()));
        return response;
    }

    @Transactional
    void addUniversityMajor(long universityId, List<Long> majorIds ) {
        List<UniversityMajor> universityMajors = majorIds.stream()
                .map(majorId -> UniversityMajor.builder()
                        .id(UniversityMajorId.builder()
                                .universityId(universityId)
                                .majorId(majorId)
                                .build())
                        .major(majorRepository.getReferenceById(majorId))
                        .university(uniRepository.getReferenceById(universityId))
                        .build())
                .toList();
        universityMajorRepository.saveAll(universityMajors);
    }

    public List<UniversityResponse> universities() {
        List<University> universities = uniRepository.findAllByActiveIsTrue();
        return universities.stream()
                .map(university -> {
                    UniversityResponse response = uniMapper.toUniversityResponse(university);
                    response.setThumbnail("http://localhost:8080/uploads/"+university.getUniversityId()+"/thumbnail/"+university.getThumbnail());
                    List<UniversityMajor> universityMajors = universityMajorRepository
                            .findByUniversityUniversityId(university.getUniversityId())
                            .orElseThrow(() -> new RuntimeException("University majors not found for ID: " + university.getUniversityId()));

                    List<Long> majorIds = universityMajors.stream()
                            .map(um -> um.getMajor().getMajorId())
                            .toList();

                    response.setUniversityMajors(majorService.getNameMajor(majorIds));
                    return response;
                })
                .toList();
    }

    public FilteredUniversityOverviewResponse getUniversitiesByCombo(String codeCombination){
        List<MajorCombo> majorCombos = majorComboRepository
                .findMajorComboBySubjectCombinationCodeCombination(codeCombination);

        Map<Long, FilteredUniversityDetailResponse> responseMap = new LinkedHashMap<>();
        AtomicInteger totalUniversity = new AtomicInteger();

        for (MajorCombo mc : majorCombos) {
            University university = mc.getUniversity();

            responseMap.computeIfAbsent(university.getUniversityId(), id -> {
                FilteredUniversityDetailResponse response = FilteredUniversityDetailResponse.builder()
                        .university(uniMapper.toUniversityResponse(university))
                        .build();
                response.setTotal(0);

                totalUniversity.addAndGet(1);
                return response;
            });
            int count = responseMap.get(university.getUniversityId()).getTotal();
            responseMap.get(university.getUniversityId()).setTotal(count + 1);
        }

        return FilteredUniversityOverviewResponse.builder()
                .totalUniversity(totalUniversity.get())
                .detailResponseList(new ArrayList<>(responseMap.values()))
                .build();
    }

    public FilteredUniversityOverviewResponse getUniversitiesByScore(CheckScoreRequest request){
        List<StandardScore> standardScores = standardScoreRepository
                .findStandardScoreByScoreIsLessThanEqualAndStandardScoreIdScoreType(request.getScore(), request.getScoreType());

        Map<Long, FilteredUniversityDetailResponse> responseMap = new LinkedHashMap<>();
        AtomicInteger totalUniversity = new AtomicInteger();

        for (StandardScore ss : standardScores) {
            University university = ss.getUniversity();

            responseMap.computeIfAbsent(university.getUniversityId(), id -> {
                FilteredUniversityDetailResponse response = FilteredUniversityDetailResponse.builder()
                        .university(uniMapper.toUniversityResponse(university))
                        .build();
                response.setTotal(0);

                totalUniversity.addAndGet(1);
                return response;
            });
            int count = responseMap.get(university.getUniversityId()).getTotal();
            responseMap.get(university.getUniversityId()).setTotal(count + 1);

        }

        return FilteredUniversityOverviewResponse.builder()
                .totalUniversity(totalUniversity.get())
                .detailResponseList(new ArrayList<>(responseMap.values()))
                .build();
    }

    public FilteredUniversityOverviewResponse getUniversitiesByMajor(long majorId) {
        List<UniversityMajor> universityMajors = universityMajorRepository.findByMajorMajorId(majorId);

        Map<Long, FilteredUniversityDetailResponse> responseMap = new LinkedHashMap<>();
        AtomicInteger totalUniversity = new AtomicInteger();

        for (UniversityMajor um : universityMajors) {
            University university = um.getUniversity();

            responseMap.computeIfAbsent(university.getUniversityId(), id -> {
                FilteredUniversityDetailResponse response = new FilteredUniversityDetailResponse();
                response.setTotal(0);
                UniversityResponse universityResponse = uniMapper.toUniversityResponse(university);
                universityResponse.setUniversityMajors(new ArrayList<>());
                response.setUniversity(universityResponse);
                totalUniversity.addAndGet(1);
                return response;
            });
            int count = responseMap.get(university.getUniversityId()).getTotal();
            responseMap.get(university.getUniversityId()).getUniversity()
                    .getUniversityMajors().add(majorService.getMajor(majorId, university.getUniversityId()));
            responseMap.get(university.getUniversityId()).setTotal(count + 1);

        }

        return FilteredUniversityOverviewResponse.builder()
                .totalUniversity(totalUniversity.get())
                .detailResponseList(new ArrayList<>(responseMap.values()))
                .build();
    }

    @Transactional
    public List<UniversityResponse> importCSV(MultipartFile file){
        List<UniversityResponse> responses = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVReader csvReader = new CSVReader(reader)) {
            String[] line;
            csvReader.readNext();
            while ((line = csvReader.readNext()) != null) {
                String code = line[0].trim();
                String name = line[1].trim();
                String alias = line[2].trim();
                UniMain main = UniMain.valueOf(line[3].trim());
                List<Long> majorIds = Arrays.stream(line[4].split("\\|"))
                        .map(String::trim)
                        .map(Long::parseLong)
                        .toList();
                University university = uniRepository.save(University.builder()
                        .code(code)
                        .universityName(name)
                        .address(alias)
                        .main(main)
                        .build());
                addUniversityMajor(university.getUniversityId(), majorIds);
                UniversityResponse response = uniMapper.toUniversityResponse(university);
                response.setUniversityMajors(majorService.getNameMajor(majorIds));
                responses.add(response);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }
        return responses;
    }

    @Transactional
    public UniversityResponse updateMajorsOfUni(UpdateMajorsOfUniRequest request, Long universityId){
        if (request.getMajorIds() == null || request.getMajorIds().isEmpty())
            throw new RuntimeException("Error");
        String majorsJson;
        try {
            majorsJson = objectMapper.writeValueAsString(request.getMajorIds());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        uniRepository.updateUniversityMajors(universityId, majorsJson);
        UniversityResponse response = uniMapper.toUniversityResponse(uniRepository.findById(universityId)
                .orElseThrow(()-> new RuntimeException("Error")));
        response.setUniversityMajors(majorService.getNameMajor(request.getMajorIds()));
        return response;
    }

    public List<UniversityResponse> getFavorites(String username) {
        List<FavoriteUniversity> favorites = favoriteUniversityRepository.findByUsername(username);
        List<UniversityResponse> responses = new ArrayList<>();
        for (FavoriteUniversity favorite : favorites) {
            University university = favorite.getUniversity();
            UniversityResponse response = uniMapper.toUniversityResponse(university);
            response.setUniversityMajors(new ArrayList<>());
            responses.add(response);
        }
        return responses;
    }

    public UniversityResponse addFavorites(long universityId, String username) {
        University university = uniRepository.getReferenceById(universityId);
        favoriteUniversityRepository.save(FavoriteUniversity.builder()
                        .username(username)
                        .university(university)
                .build());
        return uniMapper.toUniversityResponse(university);
    }

    public FilteredUniversityOverviewResponse getUniversitiesByMain(UniMain main) {
        List<University> universities = uniRepository.findAllByMain(main);
        List<FilteredUniversityDetailResponse> responses = new ArrayList<>();
        for (University university : universities){
            List<UniversityMajor> um = universityMajorRepository.findByUniversityUniversityId(university.getUniversityId())
                    .orElseThrow(()-> new RuntimeException("Error"));
            FilteredUniversityDetailResponse response = FilteredUniversityDetailResponse.builder()
                    .university(uniMapper.toUniversityResponse(university))
                    .total(um.size())
                    .build();
            responses.add(response);
        }
        return FilteredUniversityOverviewResponse.builder()
                .totalUniversity(universities.size())
                .detailResponseList(responses)
                .build();
    }

    void saveThumbnail(MultipartFile file, Long universityId) {
        String fileName = Objects.requireNonNull(file.getOriginalFilename()).replace(" ", "_");
        Path uploadPath = Paths.get(baseUploadDir, universityId.toString(), "thumbnail");
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    public UniversityResponse updateUniversity(Long universityId, UpdateUniversityRequest request) {
        University university = uniRepository.findById(universityId).orElseThrow(()-> new RuntimeException("Error"));
        uniMapper.updateUniversityFromUpdateRequest(request, university);
        MultipartFile file = request.getThumbnail();
        if(file != null && !file.isEmpty()){
            university.setThumbnail(Objects.requireNonNull(request.getThumbnail().getOriginalFilename()).replace(" ", "_"));
            saveThumbnail(request.getThumbnail(), university.getUniversityId());
        }
        uniRepository.save(university);
        return uniMapper.toUniversityResponse(university);
    }
}
