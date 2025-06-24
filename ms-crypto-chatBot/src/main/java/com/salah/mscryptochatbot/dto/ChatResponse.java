package com.salah.mscryptochatbot.dto;

public class ChatResponse {
    private final String answer;
    private final String recommendation;

    public ChatResponse(String answer, String recommendation) {
        this.answer = answer;
        this.recommendation = recommendation;
    }

    public String getAnswer() { return answer; }
    public String getRecommendation() { return recommendation; }
}
