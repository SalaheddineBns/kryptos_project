package com.example.walletservice.application.port.in;

import com.example.walletservice.domain.Transaction;
import com.example.walletservice.domain.Wallet;

import java.math.BigDecimal;
import java.util.List;

public interface WalletUseCase {
    Wallet getWalletByUserId(Long userId);
    void deposit(Long userId, BigDecimal amount);
    void withdraw(Long userId, BigDecimal amount);

    void updateWallet(Wallet wallet);
    void buyCrypto(Long userId, String symbol, BigDecimal amount);
    List<Transaction> getTransactionsByUserId(Long userId);
}
