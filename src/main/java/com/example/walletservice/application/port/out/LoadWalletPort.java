package com.example.walletservice.application.port.out;

import com.example.walletservice.domain.Transaction;
import com.example.walletservice.domain.Wallet;

import java.util.List;

public interface LoadWalletPort {
    Wallet loadByUserId(Long userId);
    List<Transaction> loadTransactionsByUserId(Long userId);
}
