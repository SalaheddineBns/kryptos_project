package com.salah.mscryptochatbot.repository;

import com.salah.mscryptochatbot.model.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    List<UserPreference> findByUserId(Long userId);
    boolean existsByUserIdAndCategory(Long userId, String category);
}