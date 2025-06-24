package com.example.walletservice.adapter.in.web.dto;

import com.example.walletservice.domain.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private TransactionType type;
    private BigDecimal amount;
    private String symbol;
    private LocalDateTime timestamp;
}
