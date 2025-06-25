package com.example.walletservice.adapter.in.web.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class EthTransactionResponse {
    private String hash;
    private String from;
    private String to;
    private BigDecimal value;
    private Instant timestamp;
}
