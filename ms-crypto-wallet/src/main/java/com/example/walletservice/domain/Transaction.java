package com.example.walletservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class Transaction {
    private Long id;
    private Long walletId;
    private TransactionType type;
    private BigDecimal amount;
    private String symbol; // null si fiat
    private LocalDateTime timestamp;
}
