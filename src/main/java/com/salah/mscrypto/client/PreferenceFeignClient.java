package com.salah.mscrypto.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "ms-crypto-chatBot", url = "http://localhost:8888")
public interface PreferenceFeignClient {

    @GetMapping("/preferences/crypto")
    List<CryptoPreference> getUserPreferences(@RequestHeader("Authorization") String token);

    @Data
    class CryptoPreference {
        private String cryptoName;
        private int interestLevel;
    }
}

