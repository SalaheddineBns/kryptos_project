package com.salah.mscryptochatbot.service;

import com.salah.mscryptochatbot.model.CryptoPreference;
import com.salah.mscryptochatbot.repository.CryptoPreferenceRepository;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final CryptoPreferenceRepository preferenceRepository;
    private final ChatModel chatModel;
    private final UserPreferenceService userPreferenceService;

    public RecommendationService(
            CryptoPreferenceRepository preferenceRepository,
            ChatModel chatModel,
            UserPreferenceService userPreferenceService) {

        this.preferenceRepository = preferenceRepository;
        this.chatModel = chatModel;
        this.userPreferenceService = userPreferenceService;
    }

    // 🧠 Recommandation simple basée sur le niveau d'intérêt max
    public String getRecommendation(String message) {
        Long userId = 1L; // temporaire

        List<CryptoPreference> preferences = preferenceRepository.findByUserId(userId);

        if (preferences.isEmpty()) {
            return "Aucune préférence enregistrée. Veuillez indiquer vos cryptomonnaies favorites.";
        }

        Optional<CryptoPreference> topPreference = preferences.stream()
                .max(Comparator.comparingInt(CryptoPreference::getInterestLevel));

        return topPreference
                .map(pref -> "Basé sur vos préférences, nous vous recommandons d'investir dans : " + pref.getCryptoName())
                .orElse("Impossible de déterminer une recommandation claire.");
    }

    // 📰 Actualités personnalisées sur les cryptos préférées
    public String getPersonalizedNews(Long userId) {
        List<CryptoPreference> prefs = preferenceRepository.findByUserId(userId);

        if (prefs.isEmpty()) {
            return "Vous n'avez pas encore de cryptos préférées enregistrées.";
        }

        // Concatène les noms des cryptos
        String joinedCryptos = prefs.stream()
                .map(CryptoPreference::getCryptoName)
                .collect(Collectors.joining(", "));

        // Demande au modèle des actus sur ces cryptos
        Prompt prompt = new Prompt(List.of(
                new SystemMessage("Tu es un expert en cryptomonnaies."),
                new UserMessage("Donne-moi des nouvelles ou recommandations sur : " + joinedCryptos)
        ));

        Message result = chatModel.call(prompt).getResult().getOutput();

        if (result instanceof AssistantMessage assistantMsg) {
            return assistantMsg.getText();  // le texte contenant des actus sur Bitcoin, ETH, etc.
        } else {
            return "Aucune recommandation trouvée.";
        }
    }
}
