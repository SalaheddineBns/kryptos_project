package com.example.walletservice.adapter.in.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WalletResponse {
    private Long id;
    private Long userId;
    private BigDecimal balance;
    private String linkedEthAddress;
    private BigDecimal ethBalanceOnChain;
}
