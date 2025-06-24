package com.salah.mscrypto.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class CoinbaseService {
    private final WebClient webClient;

    public CoinbaseService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<Map<String, Object>> getPrice(String symbol) {
        String formattedSymbol = symbol.toUpperCase();
        String url = "https://api.coinbase.com/v2/prices/" + formattedSymbol + "-USD/spot";

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }
}
