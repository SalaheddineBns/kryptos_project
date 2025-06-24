package com.example.walletservice.adapter.out.persistence;

import com.example.walletservice.application.port.out.LoadWalletPort;
import com.example.walletservice.application.port.out.UpdateWalletPort;
import com.example.walletservice.domain.Transaction;
import com.example.walletservice.domain.Wallet;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class WalletJpaAdapter implements LoadWalletPort, UpdateWalletPort {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final WalletMapper walletMapper;
    private final TransactionMapper transactionMapper;

    @Override
    public Wallet loadByUserId(Long userId) {
        WalletEntity walletEntity = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet non trouvé pour l'utilisateur : " + userId));
        return walletMapper.toDomain(walletEntity);
    }

    @Override
    public void updateWallet(Wallet wallet) {
        WalletEntity entity = walletMapper.toEntity(wallet);
        walletRepository.save(entity);
    }

    @Override
    public void recordTransaction(Transaction transaction) {
        TransactionEntity entity = transactionMapper.toEntity(transaction);
        transactionRepository.save(entity);
    }
    @Override
    public List<Transaction> loadTransactionsByUserId(Long userId) {
        return transactionRepository.findByWalletId(userId)
                .stream()
                .map(transactionMapper::toDomain)
                .collect(Collectors.toList());
    }

}
