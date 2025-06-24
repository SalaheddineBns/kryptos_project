package com.salah.mscryptochatbot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;
    private String categorie;

    public Produit() {}

    public Produit(String nom, String description, String categorie) {
        this.nom = nom;
        this.description = description;
        this.categorie = categorie;
    }

    // Getters and Setters
}