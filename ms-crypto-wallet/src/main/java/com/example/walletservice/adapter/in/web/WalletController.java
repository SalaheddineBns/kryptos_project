package com.example.walletservice.adapter.in.web;

import com.example.walletservice.adapter.in.web.dto.EthTransactionResponse;
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


    @GetMapping("/{userId}/eth-transactions")
    public ResponseEntity<List<EthTransactionResponse>> getEthTransactions(@PathVariable Long userId) {
        Wallet wallet = walletUseCase.getWalletByUserId(userId);
        String ethAddress = wallet.getLinkedEthAddress();

        if (ethAddress == null || !ethAddress.startsWith("0x")) {
            return ResponseEntity.badRequest().build();
        }

        List<EthTransactionResponse> ethTxs = blockchainAdapter.getTransactions(ethAddress);
        return ResponseEntity.ok(ethTxs);
    }


}
