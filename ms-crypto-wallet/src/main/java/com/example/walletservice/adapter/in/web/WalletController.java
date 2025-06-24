package com.example.walletservice.adapter.in.web;

import com.example.walletservice.adapter.in.web.dto.BuyCryptoRequest;
import com.example.walletservice.adapter.in.web.dto.TransactionResponse;
import com.example.walletservice.adapter.in.web.dto.WalletResponse;
import com.example.walletservice.application.port.in.WalletUseCase;
import com.example.walletservice.domain.Transaction;
import com.example.walletservice.domain.Wallet;
import com.example.walletservice.adapter.out.blockchain.EthereumBlockchainAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletUseCase walletUseCase;
    private final EthereumBlockchainAdapter blockchainAdapter;

    @GetMapping("/{userId}")
    public ResponseEntity<WalletResponse> getWallet(@PathVariable Long userId) {
        Wallet wallet = walletUseCase.getWalletByUserId(userId);

        WalletResponse response = new WalletResponse();
        response.setId(wallet.getId());
        response.setUserId(wallet.getUserId());
        response.setBalance(wallet.getBalance());
        response.setLinkedEthAddress(wallet.getLinkedEthAddress());

        if (wallet.getLinkedEthAddress() != null && wallet.getLinkedEthAddress().startsWith("0x")) {
            BigDecimal ethBalance = blockchainAdapter.getEthBalance(wallet.getLinkedEthAddress());
            response.setEthBalanceOnChain(ethBalance); // ✅ type correct
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/deposit")
    public ResponseEntity<Void> deposit(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        walletUseCase.deposit(userId, amount);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/withdraw")
    public ResponseEntity<Void> withdraw(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        walletUseCase.withdraw(userId, amount);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{userId}/link-address")
    public ResponseEntity<Void> linkEthAddress(
            @PathVariable Long userId,
            @RequestBody Map<String, String> requestBody
    ) {
        String ethAddress = requestBody.get("ethAddress");

        Wallet wallet = walletUseCase.getWalletByUserId(userId);
        wallet.setLinkedEthAddress(ethAddress);
        walletUseCase.updateWallet(wallet);

        return ResponseEntity.ok().build();
    }
    @PostMapping("/{userId}/buy")
    public ResponseEntity<Void> buyCrypto(
            @PathVariable Long userId,
            @RequestBody BuyCryptoRequest request
    ) {
        walletUseCase.buyCrypto(userId, request.getSymbol(), request.getAmount());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = walletUseCase.getTransactionsByUserId(userId);

        List<TransactionResponse> responses = transactions.stream().map(tx -> {
            TransactionResponse r = new TransactionResponse();
            r.setAmount(tx.getAmount());
            r.setSymbol(tx.getSymbol());
            r.setType(tx.getType());
            r.setTimestamp(tx.getTimestamp());
            return r;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }


}
