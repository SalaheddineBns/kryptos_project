package com.salah.mscrypto.service;

import com.salah.mscrypto.model.MarketData;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class BinanceService {
    private final WebClient webClient;

    public BinanceService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<Map<String, Object>> getPrice(String symbol) {
        String formattedSymbol = symbol.toUpperCase() + "USDT";
        String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + formattedSymbol;

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }
    public Mono<Object[]> getHistoricalData(String symbol, String interval, long startTime, long endTime) {
        String formattedSymbol = symbol.toUpperCase() + "USDT";
        String url = String.format("https://api.binance.com/api/v3/klines?symbol=%s&interval=%s&startTime=%d&endTime=%d",
                formattedSymbol, interval, startTime, endTime);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object[].class); // Array of kline data
    }

}
