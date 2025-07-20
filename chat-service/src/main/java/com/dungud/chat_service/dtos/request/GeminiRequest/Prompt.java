package com.dungud.chat_service.dtos.request.GeminiRequest;

import lombok.Data;

import java.util.List;

@Data
public class Prompt {
    List<Contents> contents;
}
