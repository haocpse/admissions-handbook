package com.dungud.chat_service.controllers;

import com.dungud.chat_service.dtos.request.GeminiRequest.Parts;
import com.dungud.chat_service.dtos.response.ApiResponse;
import com.dungud.chat_service.dtos.response.ChatbotResponse;
import com.dungud.chat_service.services.GeminiAIService;
import com.dungud.chat_service.services.GeminiAIServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
public class ChatBotController {

    @Autowired
    GeminiAIService geminiService;

    @PostMapping("/call-gemini")
    public ApiResponse<ChatbotResponse> callGeminiAPI(@RequestBody Parts parts) {
        ChatbotResponse response = geminiService.getChatbotResponse(parts);
        return ApiResponse.<ChatbotResponse>builder()
                .data(response)
                .build();
    }
}
