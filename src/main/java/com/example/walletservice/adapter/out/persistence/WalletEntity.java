package com.example.walletservice.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "wallets")
@Data
public class WalletEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(name = "linked_eth_address")
    private String linkedEthAddress;

    @Column(nullable = false)
    private BigDecimal balance;
}
