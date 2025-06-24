package com.salah.mscryptochatbot.controller;

import com.salah.mscryptochatbot.model.CryptoPreference;
import com.salah.mscryptochatbot.security.JwtUtil;
import com.salah.mscryptochatbot.service.UserPreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/preferences")
public class CryptoPreferenceController {

    @Autowired
    private JwtUtil jwtUtil;

    private final UserPreferenceService service;

    public CryptoPreferenceController(UserPreferenceService service) {
        this.service = service;
    }

    @PostMapping
    public void savePreference(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CryptoPreference preference) {

        try {
            String token = authHeader.replace("Bearer ", "").trim();
            Long userId = jwtUtil.extractUserIdFromToken(token);
            System.out.println("User ID: " + userId);
            service.savePreference(userId, preference.getCryptoName(), preference.getInterestLevel());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'enregistrement des préférences : " + e.getMessage());
        }
    }


    @GetMapping("/crypto")
    public List<CryptoPreference> getByUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        System.out.println(token);
        Long userId = jwtUtil.extractUserIdFromToken(token);
        return service.getPreferencesByUser(userId);
    }

    @DeleteMapping("/crypto/{userId}")
    public void deleteByUser(@PathVariable Long userId) {
        service.deletePreferencesByUser(userId);
    }

    @DeleteMapping("/crypto/{userId}/{cryptoName}")
    public void deletePreference(@PathVariable Long userId, @PathVariable String cryptoName) {
        service.deletePreferenceByUserAndCrypto(userId, cryptoName);
    }


}
