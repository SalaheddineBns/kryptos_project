package com.salah.mscryptoalerts.service;

import com.salah.mscryptoalerts.model.PriceAlert;
import com.salah.mscryptoalerts.model.PriceCondition;
import com.salah.mscryptoalerts.repository.PriceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PriceCheckerScheduler {

    @Autowired
    private PriceAlertRepository alertRepository;

    @Autowired
    private PriceFetcher priceFetcher;

    @Autowired
    private EmailService emailService;

    @Scheduled(fixedRate = 60000)
    public void checkAlerts() {
        List<PriceAlert> alerts = alertRepository.findAll();
        System.out.println(alerts.size() + " alert(s) found.");
        for (PriceAlert alert : alerts) {
            double currentPrice = priceFetcher.fetchCurrentPrice(alert.getCryptoSymbol());
            System.out.println(currentPrice);
            boolean triggered = switch (alert.getCondition()) {
                case ABOVE -> currentPrice > alert.getTargetPrice();
                case BELOW -> currentPrice < alert.getTargetPrice();
            };

            System.out.println(triggered);
            if (triggered) {
                String subject = "🚨 Alerte Crypto : " + alert.getCryptoSymbol();
                String body = "Bonjour,\n\nLe prix de " + alert.getCryptoSymbol() +
                        " est maintenant de " + currentPrice + " USD.\n" +
                        "Il a " + (alert.getCondition() == PriceCondition.ABOVE ? "dépassé" : "chuté sous") +
                        " votre seuil de " + alert.getTargetPrice() + " USD.";

                //emailService.send(alert.getUserEmail(), subject, body);

                System.out.println("🔔 Alerte déclenchée !");
                System.out.println("Utilisateur : " + alert.getUserEmail());
                System.out.println("Crypto : " + alert.getCryptoSymbol());
                System.out.println("Prix actuel : " + currentPrice);
                System.out.println("Condition : " + alert.getCondition());
                System.out.println("Seuil défini : " + alert.getTargetPrice());


                // Optionnel : désactiver ou supprimer après envoi
                alertRepository.delete(alert);
            }
        }
    }
}

