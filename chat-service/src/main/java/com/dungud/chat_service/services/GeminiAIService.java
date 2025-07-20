package com.dungud.chat_service.services;

import com.dungud.chat_service.dtos.request.GeminiRequest.Parts;
import com.dungud.chat_service.dtos.response.ChatbotResponse;

public interface GeminiAIService {
    ChatbotResponse getChatbotResponse(Parts parts);
}
