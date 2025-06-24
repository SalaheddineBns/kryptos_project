package com.salah.mscryptochatbot.model;


import jakarta.persistence.*;

@Entity
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String category;
    private int interestLevel;

    public UserPreference() {}

    public UserPreference(Long userId, String category, int interestLevel) {
        this.userId = userId;
        this.category = category;
        this.interestLevel = interestLevel;
    }

    // Getters and Setters
}