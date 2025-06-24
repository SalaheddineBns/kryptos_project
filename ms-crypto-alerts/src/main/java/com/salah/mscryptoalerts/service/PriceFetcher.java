package com.salah.mscryptoalerts.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.json.JSONObject;

@Service
public class PriceFetcher {

    private static final String BINANCE_API_URL = "https://api.binance.com/api/v3/ticker/price";

    public double fetchCurrentPrice(String symbol) {
        String tradingPair = symbol.toUpperCase() + "USDT";

        String url = UriComponentsBuilder
                .fromHttpUrl(BINANCE_API_URL)
                .queryParam("symbol", tradingPair)
                .toUriString();

        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);
            System.out.println("📩 Réponse Binance : " + response); // 🔍 Debug

            JSONObject json = new JSONObject(response);
            return json.getDouble("price");
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'appel à Binance pour : " + tradingPair);
            e.printStackTrace();
            return -1; // valeur temporaire pour identifier une erreur
        }
    }
}
