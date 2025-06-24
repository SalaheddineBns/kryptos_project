package com.salah.mscrypto.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MarketData {
    private String symbol;
    private BigDecimal price;
    private BigDecimal volume;
    private String exchange;
}

