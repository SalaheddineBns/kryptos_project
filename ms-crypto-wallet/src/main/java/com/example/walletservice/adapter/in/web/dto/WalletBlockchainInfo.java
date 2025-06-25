package com.example.walletservice.adapter.in.web.dto;

import java.util.List;

public class WalletBlockchainInfo {
    private String ethAddress;
    private String ethBalance;
    private List<EthTransactionResponse> transactions;
}
