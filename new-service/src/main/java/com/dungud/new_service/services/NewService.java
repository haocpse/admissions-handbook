package com.dungud.new_service.services;

import com.dungud.new_service.dtos.requests.NewCreateRequest;
import com.dungud.new_service.dtos.responses.NewDetailResponse;
import com.dungud.new_service.dtos.responses.NewListResponse;

public interface NewService {
    void createNew(NewCreateRequest request);
    void deleteNew(Long newId);
    NewDetailResponse getNewDetail(Long newId);
    NewListResponse getNewList();
}
