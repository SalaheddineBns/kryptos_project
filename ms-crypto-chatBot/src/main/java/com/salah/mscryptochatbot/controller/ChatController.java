package com.salah.mscryptochatbot.controller;

import com.salah.mscryptochatbot.dto.ChatRequest;
import com.salah.mscryptochatbot.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Map<String, String> chat(@RequestBody ChatRequest request) {
        var result = chatService.ask(request.getMessage());

        return Map.of(
                "response", result.getAnswer(),
                "recommendation", result.getRecommendation()
        );
    }
}
