package com.example.walletservice.adapter.out.blockchain;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Convert;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Adapter qui interroge le réseau Ethereum (via Infura) pour lire le solde d'une adresse ETH.
 */
@Component
@RequiredArgsConstructor
public class EthereumBlockchainAdapter {

    @Value("${blockchain.ethereum.node-url}")
    private String nodeUrl;

    private Web3j web3j;

    /**
     * Initialise le client Web3j une seule fois après l'injection de dépendances.
     */
    @PostConstruct
    public void init() {
        this.web3j = Web3j.build(new HttpService(nodeUrl));
    }

    /**
     * Lit le solde (en ETH) d'une adresse Ethereum publique.
     *
     * @param address Adresse publique Ethereum (0x...)
     * @return Solde en ETH (BigDecimal)
     */
    public BigDecimal getEthBalance(String address) {
        try {
            EthGetBalance balanceResponse = web3j
                    .ethGetBalance(address, DefaultBlockParameterName.LATEST)
                    .send();

            BigInteger balanceInWei = balanceResponse.getBalance();
            BigDecimal balanceInEth = Convert.fromWei(balanceInWei.toString(), Convert.Unit.ETHER);

            System.out.println("Solde ETH de " + address + " = " + balanceInEth + " ETH"); // 🔍 Ajout ici

            return balanceInEth;

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la lecture du solde ETH", e);
        }
    }

}
