package com.salah.mscryptochatbot.dto;

import lombok.Data;

@Data
public class CryptoPreferenceDTO {
    private Long userId;
    private String cryptoName;
    private int interestLevel;
    // Getters & Setters
}
