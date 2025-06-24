package com.salah.identitycryptoservice.controller;


import com.salah.identitycryptoservice.dto.LoginRequestDto;
import com.salah.identitycryptoservice.dto.LoginResponseDto;
import com.salah.identitycryptoservice.dto.RegisterRequestDto;
import com.salah.identitycryptoservice.dto.RegisterResponseDto;
import com.salah.identitycryptoservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterRequestDto request) {
        RegisterResponseDto userDto = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

   @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
       LoginResponseDto response = authService.login(request);
       return ResponseEntity.ok(response);
  }
}

