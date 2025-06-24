package com.salah.mscryptochatbot.repository;

import com.salah.mscryptochatbot.model.CryptoPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CryptoPreferenceRepository extends JpaRepository<CryptoPreference, Long> {
    List<CryptoPreference> findByUserId(Long userId);
    void deleteByUserId(Long userId);
    void deleteByUserIdAndCryptoNameIgnoreCase(Long userId, String cryptoName);

}
