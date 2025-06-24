package com.salah.mscryptoalerts.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;           // Email de l'utilisateur
    private String cryptoSymbol;        // Symbole de la crypto : BTC, ETH, etc.
    private double targetPrice;         // Seuil d'alerte

    @Enumerated(EnumType.STRING)
    private PriceCondition condition;   // ABOVE ou BELOW

    private Long userId;                // Lien vers utilisateur (optionnel)
}
