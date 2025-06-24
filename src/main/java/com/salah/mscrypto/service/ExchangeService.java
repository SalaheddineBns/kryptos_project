package com.salah.mscrypto.service;

import com.salah.mscrypto.model.MarketData;

public interface ExchangeService {
    MarketData getMarketData(String symbol);
}
