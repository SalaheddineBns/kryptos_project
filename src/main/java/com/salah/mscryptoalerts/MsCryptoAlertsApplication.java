package com.salah.mscryptoalerts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class MsCryptoAlertsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsCryptoAlertsApplication.class, args);
    }

}
