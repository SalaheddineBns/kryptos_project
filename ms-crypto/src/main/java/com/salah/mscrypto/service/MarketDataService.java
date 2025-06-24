package com.salah.mscrypto.service;


import com.salah.mscrypto.model.MarketData;

public interface MarketDataService {
    MarketData getAggregatedMarketData(String symbol);
}
