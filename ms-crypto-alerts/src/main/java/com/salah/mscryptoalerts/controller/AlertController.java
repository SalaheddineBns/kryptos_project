package com.salah.mscryptoalerts.controller;

import com.salah.mscryptoalerts.model.PriceAlert;
import com.salah.mscryptoalerts.security.JwtUtil; // ⚠️ à importer !
import com.salah.mscryptoalerts.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @Autowired
    private JwtUtil jwtUtil; // N'oublie pas de l'injecter !

    @PostMapping
    public void createAlert(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PriceAlert alert) {
        try {
            System.out.println(authHeader.replace("Bearer ", "").trim());
            String token = authHeader.replace("Bearer ", "").trim();
            Long userId = jwtUtil.extractUserIdFromToken(token);
            alert.setUserId(userId);

            System.out.println("🔐 Création d'une alerte pour l'utilisateur ID: " + userId);
            alertService.createAlert(alert);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la création de l'alerte : " + e.getMessage());
        }
    }

    @GetMapping
    public List<PriceAlert> getUserAlerts(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            Long userId = jwtUtil.extractUserIdFromToken(token);
            return alertService.getAlertsByUser(userId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la récupération des alertes : " + e.getMessage());
        }
    }

    @DeleteMapping("/{alertId}")
    public void deleteAlert(@PathVariable Long alertId,
                            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            Long userId = jwtUtil.extractUserIdFromToken(token);
            alertService.deleteAlert(alertId, userId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la suppression de l'alerte : " + e.getMessage());
        }
    }

}
