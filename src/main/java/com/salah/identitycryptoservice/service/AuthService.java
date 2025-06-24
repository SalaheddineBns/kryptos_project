package com.salah.identitycryptoservice.service;


import com.salah.identitycryptoservice.dto.LoginRequestDto;
import com.salah.identitycryptoservice.dto.LoginResponseDto;
import com.salah.identitycryptoservice.dto.RegisterRequestDto;
import com.salah.identitycryptoservice.dto.RegisterResponseDto;
import com.salah.identitycryptoservice.model.User;
import com.salah.identitycryptoservice.repository.UserRepository;
import com.salah.identitycryptoservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private  AuthenticationManager authenticationManager;

    public RegisterResponseDto register(RegisterRequestDto request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        User savedUser = userRepository.save(user);

        // Retourner un DTO
        return new RegisterResponseDto(
                savedUser.getUserId(),
                savedUser.getEmail()
        );

    }

    public LoginResponseDto login(LoginRequestDto request) {
 User user = userRepository.findByEmail(request.email())
               .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));

      if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
      }
        String token = jwtUtil.generateToken(user.getEmail()); // Email ou ID selon ton choix
        return new LoginResponseDto(token, user.getEmail());
   }
}


