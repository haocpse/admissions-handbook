package com.haocp.school_service.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.requests.UpdateMajorsOfUniRequest;
import com.haocp.school_service.dtos.responses.UniversityMajorResponse;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.*;
import com.haocp.school_service.entities.enums.UniMain;
import com.haocp.school_service.mapper.UniMapper;
import com.haocp.school_service.repositories.MajorRepository;
import com.haocp.school_service.repositories.UniRepository;
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
import java.util.Arrays;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
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

    @Transactional
    public UniversityResponse addUniversity(AddUniversityRequest request) {
        University university = uniRepository.save(uniMapper.toUniversity(request));
        addUniversityMajor(university.getUniversityId(), request.getMajorIds());
        UniversityResponse response = uniMapper.toUniversityResponse(university);
        response.setUniversityMajors(majorService.getNameMajor(request.getMajorIds()));
        return response;
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
                        .alias(alias)
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

}
