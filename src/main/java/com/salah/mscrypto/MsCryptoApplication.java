package com.salah.mscrypto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsCryptoApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsCryptoApplication.class, args);
    }

}
