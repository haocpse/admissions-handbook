package com.dungud.chat_service.controllers;

import com.dungud.chat_service.dtos.request.ChatCreateRequest;
import com.dungud.chat_service.dtos.request.ChatReplyRequest;
import com.dungud.chat_service.dtos.request.ChatUpdateRequest;
import com.dungud.chat_service.dtos.response.ApiResponse;
import com.dungud.chat_service.dtos.response.ChatListDetailResponse;
import com.dungud.chat_service.entities.CommunityChat;
import com.dungud.chat_service.services.CommunityChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communityChats")
public class CommunityChatController {
    @Autowired
    private CommunityChatService communityChatService;

    @PostMapping("/create")
    public ApiResponse<Void> create(@RequestBody ChatCreateRequest request) {
        communityChatService.createChat(request);
        return ApiResponse.<Void>builder()
                .message("send successfully")
                .build();
    }

    @PutMapping("/pin/{chatId}")
    public ApiResponse<Void> pin(@PathVariable Long chatId){
        communityChatService.pinChat(chatId);
        return ApiResponse.<Void>builder()
                .message("Pin successfully")
                .build();
    }

    @PutMapping("/unPin/{chatId}")
    public ApiResponse<Void> unPin(@PathVariable Long chatId){
        communityChatService.unpinChat(chatId);
        return ApiResponse.<Void>builder()
                .message("Unpin successfully")
                .build();
    }

    @DeleteMapping("/delete/{chatId}")
    public ApiResponse<Void> delete(@PathVariable Long chatId) {
        communityChatService.deleteChat(chatId);
        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }

    @PutMapping("/update/{chatId}")
    public ApiResponse<Void> update(@PathVariable Long chatId, @RequestBody ChatUpdateRequest request) {
        communityChatService.updateChat(chatId, request);
        return ApiResponse.<Void>builder()
                .message("Update successfully")
                .build();
    }

    @PostMapping("/replyChat/{chatId}")
    public ApiResponse<Void> replyChat(@PathVariable Long chatId, @RequestBody ChatReplyRequest request) {
        communityChatService.replyChat(chatId, request);
        return ApiResponse.<Void>builder()
                .message("Reply successfully")
                .build();
    }

    @GetMapping("/getAllChats")
    public ApiResponse<ChatListDetailResponse> getAllChats() {
        ChatListDetailResponse chatList = communityChatService.getAll();
        return ApiResponse.<ChatListDetailResponse>builder()
                .data(chatList)
                .build();
    }
}
