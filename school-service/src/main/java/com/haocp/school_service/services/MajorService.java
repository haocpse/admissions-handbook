package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.Major;
import com.haocp.school_service.entities.University;
import com.haocp.school_service.entities.enums.UniMain;
import com.haocp.school_service.mapper.MajorMapper;
import com.haocp.school_service.repositories.MajorRepository;
import com.opencsv.CSVReader;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public List<MajorResponse> importCSV(MultipartFile file) {
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
}
