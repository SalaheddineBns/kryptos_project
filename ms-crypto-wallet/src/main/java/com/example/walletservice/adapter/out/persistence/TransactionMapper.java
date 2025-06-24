package com.example.walletservice.adapter.out.persistence;

import com.example.walletservice.domain.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionEntity toEntity(Transaction transaction) {
        TransactionEntity entity = new TransactionEntity();
        entity.setId(transaction.getId());
        entity.setWalletId(transaction.getWalletId());
        entity.setType(transaction.getType());
        entity.setAmount(transaction.getAmount());
        entity.setSymbol(transaction.getSymbol());
        entity.setTimestamp(transaction.getTimestamp());
        return entity;
    }

    public Transaction toDomain(TransactionEntity entity) {
        return new Transaction(
                entity.getId(),
                entity.getWalletId(),
                entity.getType(),
                entity.getAmount(),
                entity.getSymbol(),
                entity.getTimestamp()
        );
    }
}
