package com.salah.identitycryptoservice.controller;

import com.salah.identitycryptoservice.dto.UserDto;
import com.salah.identitycryptoservice.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    CustomUserDetailsService customUserDetailsService;
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(customUserDetailsService.getAllUsers());
    }
}
