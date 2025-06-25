package com.example.walletservice.adapter.out.blockchain;

import com.example.walletservice.adapter.in.web.dto.EthTransactionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class EthereumBlockchainAdapter {

    private static final String ETHERSCAN_API_KEY = "NF5IGWV52PK4KZCVEF4NXPFD2ZQ8SNHGKA"; // sécurise-le dans application.properties
    private static final String ETHERSCAN_API_URL = "https://api.etherscan.io/api";

    public BigDecimal getEthBalance(String address) {
        String url = ETHERSCAN_API_URL +
                "?module=account&action=balance&address=" + address +
                "&tag=latest&apikey=" + ETHERSCAN_API_KEY;

        ResponseEntity<JsonNode> response = new RestTemplate().getForEntity(url, JsonNode.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String balanceWei = response.getBody().get("result").asText();
            return new BigDecimal(balanceWei).divide(BigDecimal.TEN.pow(18));
        }

        return BigDecimal.ZERO;
    }

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
