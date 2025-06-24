package com.example.walletservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Data
@AllArgsConstructor
public class Wallet {
    private Long id;
    private Long userId;
    private BigDecimal balance;
    private String linkedEthAddress;
    private List<CryptoHolding> holdings;
    public void addCrypto(String symbol, BigDecimal amount) {
        Optional<CryptoHolding> existing = holdings.stream()
                .filter(h -> h.getSymbol().equalsIgnoreCase(symbol))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setAmount(existing.get().getAmount().add(amount));
        } else {
            holdings.add(new CryptoHolding(symbol, amount));
        }
    }

}
