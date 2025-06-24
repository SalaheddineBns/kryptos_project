package com.example.walletservice.adapter.in.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BuyCryptoRequest {
    private String symbol;
    private BigDecimal amount;
}
