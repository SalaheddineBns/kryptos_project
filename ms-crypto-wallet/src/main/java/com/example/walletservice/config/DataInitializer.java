package com.example.walletservice.config;

import com.example.walletservice.adapter.out.persistence.WalletEntity;
import com.example.walletservice.adapter.out.persistence.WalletRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final WalletRepository walletRepository;

    @PostConstruct
    public void init() {
        if (walletRepository.findByUserId(1L).isEmpty()) {
            WalletEntity wallet = new WalletEntity();
            wallet.setUserId(1L);
            wallet.setBalance(new BigDecimal("1000.00"));
            walletRepository.save(wallet);
            System.out.println("✅ Wallet userId=1 initialisé avec 1000.00");
        }
    }
}
