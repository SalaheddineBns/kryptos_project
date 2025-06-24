package com.example.walletservice.adapter.in.web;
import com.example.walletservice.adapter.out.blockchain.EthereumBlockchainAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Contrôleur REST pour interroger la blockchain Ethereum.
 */
@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletBlockchainController {

    private final EthereumBlockchainAdapter blockchainAdapter;

    /**
     * Endpoint pour récupérer le solde ETH d'une adresse Ethereum.
     * Exemple : GET /wallet/0x742d.../eth-balance
     */
    @GetMapping("/{address}/eth-balance")
    public ResponseEntity<BigDecimal> getEthBalance(@PathVariable String address) {
        BigDecimal balance = blockchainAdapter.getEthBalance(address);
        return ResponseEntity.ok(balance);
    }
}

