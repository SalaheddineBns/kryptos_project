package com.salah.mscryptochatbot.service;

import com.salah.mscryptochatbot.model.CryptoPreference;
import com.salah.mscryptochatbot.repository.CryptoPreferenceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CryptoPreferenceService {

    private final CryptoPreferenceRepository repository;

    public CryptoPreferenceService(CryptoPreferenceRepository repository) {
        this.repository = repository;
    }

    public void savePreference(Long userId, String cryptoName, int level) {
        var preference = new CryptoPreference(null, userId, cryptoName, level);
        repository.save(preference);
    }

    public List<CryptoPreference> getPreferences(Long userId) {
        return repository.findByUserId(userId);
    }

}
