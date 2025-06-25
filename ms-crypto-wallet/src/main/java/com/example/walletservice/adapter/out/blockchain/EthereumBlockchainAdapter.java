package com.example.walletservice.adapter.out.blockchain;

import com.example.walletservice.adapter.in.web.dto.EthTransactionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Convert;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class EthereumBlockchainAdapter {

    // URL d’Infura (Web3j)
    private static final String NODE_URL = "https://mainnet.infura.io/v3/1b3573a9c71545b18f336bebbcfd296f";

    // Clé API d’Etherscan
    private static final String ETHERSCAN_API_KEY = "NF5IGWV52PK4KZCVEF4NXPFD2ZQ8SNHGKA";
    private static final String ETHERSCAN_API_URL = "https://api.etherscan.io/api";

    private Web3j web3j;

    @PostConstruct
    public void init() {
        this.web3j = Web3j.build(new HttpService(NODE_URL));
    }

    /**
     * Récupère le solde ETH d'une adresse avec Web3j (via Infura).
     */
    public BigDecimal getEthBalance(String address) {
        try {
            EthGetBalance balanceResponse = web3j
                    .ethGetBalance(address, DefaultBlockParameterName.LATEST)
                    .send();

            BigInteger balanceInWei = balanceResponse.getBalance();
            return Convert.fromWei(balanceInWei.toString(), Convert.Unit.ETHER);

        } catch (Exception e) {
            log.error("Erreur lors de la lecture du solde ETH via Web3j", e);
            return BigDecimal.ZERO;
        }
    }

    /**
     * Récupère l'historique des transactions depuis Etherscan.
     */
    public List<EthTransactionResponse> getTransactions(String address) {
        String url = ETHERSCAN_API_URL +
                "?module=account&action=txlist" +
                "&address=" + address +
                "&startblock=0&endblock=99999999&sort=desc" +
                "&apikey=" + ETHERSCAN_API_KEY;

        ResponseEntity<JsonNode> response = new RestTemplate().getForEntity(url, JsonNode.class);
        List<EthTransactionResponse> transactions = new ArrayList<>();

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode result = response.getBody().get("result");
            for (JsonNode tx : result) {
                EthTransactionResponse tr = new EthTransactionResponse();
                tr.setHash(tx.get("hash").asText());
                tr.setFrom(tx.get("from").asText());
                tr.setTo(tx.get("to").asText());
                tr.setValue(new BigDecimal(tx.get("value").asText()).divide(BigDecimal.TEN.pow(18)));
                tr.setTimestamp(Instant.ofEpochSecond(Long.parseLong(tx.get("timeStamp").asText())));
                transactions.add(tr);
            }
        }

        return transactions;
    }
}
