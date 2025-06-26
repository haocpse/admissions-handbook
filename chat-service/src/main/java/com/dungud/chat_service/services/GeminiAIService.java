package com.dungud.chat_service.services;

import com.dungud.chat_service.dtos.request.GeminiRequest.Contents;
import com.dungud.chat_service.dtos.request.GeminiRequest.Parts;
import com.dungud.chat_service.dtos.response.ChatbotResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import com.dungud.chat_service.dtos.request.GeminiRequest.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiAIService {
    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    @Autowired
    public GeminiAIService(@Qualifier("externalRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ChatbotResponse getChatbotResponse(Parts parts) {
        Prompt prompt = new Prompt();
        Contents contents = new Contents();

        List<Contents> contentsList = new ArrayList<>();
        List<Parts> partsList = new ArrayList<>();

        partsList.add(parts);

        contents.setParts(partsList);

        contentsList.add(contents);
        prompt.setContents(contentsList);
        HttpEntity<Prompt> requestEntity = new HttpEntity<>(prompt);
        ResponseEntity<Object> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                Object.class
        );

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.valueToTree(response.getBody());

        // Truy xuất text ở: candidates[0] -> content -> parts[0] -> text
        JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
        return ChatbotResponse.builder()
                .answer(textNode.asText())
                .build();
    }
}
