package com.salah.mscryptochatbot.service;

import com.salah.mscryptochatbot.dto.ChatResponse;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatModel chatModel;
    private final RecommendationService recoService;
    private final UserPreferenceService userPreferenceService;

    public ChatService(@Qualifier("mistralModel") ChatModel chatModel,
                       RecommendationService recoService,
                       UserPreferenceService userPreferenceService) {
        this.chatModel = chatModel;
        this.recoService = recoService;
        this.userPreferenceService = userPreferenceService;
    }

    public ChatResponse ask(String userMessage) {
        System.out.println("Message reçu : " + userMessage);
        Long userId = 1L; // temporaire pour tests

        // 🔍 Si demande de news/recommandations personnalisées
        if (userMessage.toLowerCase().contains("news") || userMessage.toLowerCase().contains("nouvelles")) {
            String reco = recoService.getPersonalizedNews(userId);
            return new ChatResponse("Voici les recommandations personnalisées :", reco);
        }

        Prompt prompt = new Prompt(List.of(
                new SystemMessage("Tu es un expert en cryptomonnaies."),
                new UserMessage(userMessage)
        ));

        try {
            var result = chatModel.call(prompt).getResult();
            Message output = result.getOutput();

            String gptAnswer = (output instanceof AssistantMessage msg)
                    ? msg.getText()
                    : "Réponse non comprise.";

            detectAndStorePreference(userMessage, userId);

            String recommendation = recoService.getRecommendation(userMessage);

            return new ChatResponse(gptAnswer, recommendation);
        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Erreur interne : " + e.getMessage(), "");
        }
    }

    private void detectAndStorePreference(String message, Long userId) {
        List<String> categories = List.of("NFT", "DeFi", "Gaming", "Metaverse", "Privacy");

        for (String cat : categories) {
            if (message.toLowerCase().contains(cat.toLowerCase())) {
                userPreferenceService.savePreference(userId, cat, 5);
                System.out.println("Préférence détectée et enregistrée : " + cat);
            }
        }
    }
}
