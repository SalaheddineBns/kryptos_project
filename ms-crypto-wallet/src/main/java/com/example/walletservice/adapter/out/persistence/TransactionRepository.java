package com.example.walletservice.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
    // Tu pourras ajouter des méthodes plus tard pour l’historique
    List<TransactionEntity> findByWalletId(Long walletId);
}
