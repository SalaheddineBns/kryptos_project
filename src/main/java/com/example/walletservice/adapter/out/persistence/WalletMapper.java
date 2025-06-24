package com.example.walletservice.adapter.out.persistence;

import com.example.walletservice.domain.Wallet;
import com.example.walletservice.domain.CryptoHolding;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class WalletMapper {

    public WalletEntity toEntity(Wallet wallet) {
        WalletEntity entity = new WalletEntity();
        entity.setId(wallet.getId());
        entity.setUserId(wallet.getUserId());
        entity.setBalance(wallet.getBalance());
        entity.setLinkedEthAddress(wallet.getLinkedEthAddress());
        // Tu peux mapper holdings plus tard si tu veux les persister
        return entity;
    }

    public Wallet toDomain(WalletEntity entity) {
        List<CryptoHolding> holdings = new ArrayList<>();

        return new Wallet(
                entity.getId(),
                entity.getUserId(),
                entity.getBalance(),
                entity.getLinkedEthAddress(),
                holdings
        );
    }
}
