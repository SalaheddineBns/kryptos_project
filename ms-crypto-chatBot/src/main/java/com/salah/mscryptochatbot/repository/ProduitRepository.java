package com.salah.mscryptochatbot.repository;


import com.salah.mscryptochatbot.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    Optional<Produit> findTopByCategorie(String categorie);
}