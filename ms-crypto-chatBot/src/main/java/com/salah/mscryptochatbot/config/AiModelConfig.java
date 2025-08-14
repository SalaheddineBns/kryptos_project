package com.salah.mscryptochatbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;

@Configuration
public class AiModelConfig {

    @Bean
    public ChatModel mistralModel() {
        OpenAiChatOptions options = new OpenAiChatOptions();
        options.setModel("mistralai/Mistral-7B-Instruct-v0.2");


        OpenAiApi openAiApi = new OpenAiApi.Builder()
                .baseUrl("https://api.together.xyz")
                .apiKey("xxxxxxxxxxxxxx")
                .build();

        return new OpenAiChatModel(openAiApi, options);
    }
}
