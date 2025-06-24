package com.salah.mscryptochatbot.service;

import com.salah.mscryptochatbot.model.CryptoPreference;
import com.salah.mscryptochatbot.repository.CryptoPreferenceRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserPreferenceService {

    private final CryptoPreferenceRepository repository;

    public UserPreferenceService(CryptoPreferenceRepository repository) {
        this.repository = repository;
    }

    public void savePreference(Long userId, String cryptoName, int level) {
        CryptoPreference preference = new CryptoPreference(null, userId, cryptoName, level);
        repository.save(preference);
    }

    public List<CryptoPreference> getPreferencesByUser(Long userId) {
        return repository.findByUserId(userId);
    }
    public void deletePreferencesByUser(Long userId) {
        repository.deleteByUserId(userId);
    }

    @Transactional
    public void deletePreferenceByUserAndCrypto(Long userId, String cryptoName) {
        repository.deleteByUserIdAndCryptoNameIgnoreCase(userId, cryptoName);
    }

}
