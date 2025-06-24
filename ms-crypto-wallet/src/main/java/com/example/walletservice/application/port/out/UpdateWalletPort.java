package com.example.walletservice.application.port.out;

import com.example.walletservice.domain.Transaction;
import com.example.walletservice.domain.Wallet;

public interface UpdateWalletPort {
    void updateWallet(Wallet wallet);
    void recordTransaction(Transaction transaction);
}
