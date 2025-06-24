package com.example.walletservice.application.service;

import com.example.walletservice.application.port.in.WalletUseCase;
import com.example.walletservice.application.port.out.LoadWalletPort;
import com.example.walletservice.application.port.out.UpdateWalletPort;
import com.example.walletservice.domain.Transaction;
import com.example.walletservice.domain.TransactionType;
import com.example.walletservice.domain.Wallet;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletUseCase {

    private final LoadWalletPort loadWalletPort;
    private final UpdateWalletPort updateWalletPort;

    @Override
    public Wallet getWalletByUserId(Long userId) {
        return loadWalletPort.loadByUserId(userId);
    }

    @Override
    public void deposit(Long userId, BigDecimal amount) {
        Wallet wallet = loadWalletPort.loadByUserId(userId);
        wallet.setBalance(wallet.getBalance().add(amount));

        Transaction tx = new Transaction(
                null,
                wallet.getId(),
                TransactionType.DEPOSIT,
                amount,
                null,
                LocalDateTime.now()
        );

        updateWalletPort.updateWallet(wallet);
        updateWalletPort.recordTransaction(tx);
    }

    @Override
    public void withdraw(Long userId, BigDecimal amount) {
        Wallet wallet = loadWalletPort.loadByUserId(userId);

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Solde insuffisant");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));

        Transaction tx = new Transaction(
                null,
                wallet.getId(),
                TransactionType.WITHDRAW,
                amount,
                null,
                LocalDateTime.now()
        );

        updateWalletPort.updateWallet(wallet);
        updateWalletPort.recordTransaction(tx);
    }
    @Override
    public void updateWallet(Wallet wallet) {
        updateWalletPort.updateWallet(wallet); // appelle le port out
    }
    @Override
    public void buyCrypto(Long userId, String symbol, BigDecimal amount) {
        Wallet wallet = loadWalletPort.loadByUserId(userId);

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant.");
        }

        // Déduire le montant
        wallet.setBalance(wallet.getBalance().subtract(amount));

        // Ajouter ou mettre à jour le holding
        wallet.addCrypto(symbol, amount); // méthode à créer si pas encore faite

        // Sauvegarder le wallet
        updateWalletPort.updateWallet(wallet);

        // Enregistrer la transaction
        Transaction transaction = new Transaction(
                null, userId, TransactionType.BUY_CRYPTO, amount, symbol, LocalDateTime.now()
        );
        updateWalletPort.recordTransaction(transaction);
    }
    @Override
    public List<Transaction> getTransactionsByUserId(Long userId) {
        return loadWalletPort.loadTransactionsByUserId(userId);
    }

}
