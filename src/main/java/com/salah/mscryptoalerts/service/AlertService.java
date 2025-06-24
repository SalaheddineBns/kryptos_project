package com.salah.mscryptoalerts.service;


import com.salah.mscryptoalerts.model.PriceAlert;
import com.salah.mscryptoalerts.repository.PriceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private PriceAlertRepository alertRepository;

    public void createAlert(PriceAlert alert) {
        alertRepository.save(alert);
    }

    public List<PriceAlert> getAlertsByUser(Long userId) {
        return alertRepository.findByUserId(userId);
    }

    public void deleteAlert(Long alertId, Long userId) {
        // 🔧 On cherche par ID et par userId pour éviter les suppressions non autorisées
        Optional<PriceAlert> optionalAlert = alertRepository.findById(alertId);
        if (optionalAlert.isEmpty()) {
            throw new RuntimeException("Alerte non trouvée");
        }

        PriceAlert alert = optionalAlert.get();
        if (!alert.getUserId().equals(userId)) {
            throw new RuntimeException("Suppression non autorisée");
        }

        alertRepository.delete(alert);
    }


}