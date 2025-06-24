package com.salah.mscrypto.controller;

import com.salah.mscrypto.client.PreferenceFeignClient;
import com.salah.mscrypto.model.MarketData;
import com.salah.mscrypto.service.BinanceService;
import com.salah.mscrypto.service.CoinbaseService;
import com.salah.mscrypto.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private  BinanceService binanceService;
    private  CoinbaseService coinbaseService;

    @Autowired
    private PreferenceFeignClient preferenceClient;


    public MarketController(BinanceService binanceService, CoinbaseService coinbaseService) {
        this.binanceService = binanceService;
        this.coinbaseService = coinbaseService;
    }

    @GetMapping("/{symbol}")
    public Mono<Map<String, Object>> getMarketData(@PathVariable String symbol) {
        return Mono.zip(
                binanceService.getPrice(symbol),
                coinbaseService.getPrice(symbol)
        ).map(tuple -> {
            Map<String, Object> result = new HashMap<>();
            result.put("binance", tuple.getT1());
            result.put("coinbase", tuple.getT2());
            return result;
        });
    }
    @GetMapping("/history/preferences")
    public Mono<Map<String, Map<String, Double>>> getAveragePriceByPeriod(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "year") String period,  // year, month, week, day
            @RequestParam(defaultValue = "4") int range
    ) {
        List<PreferenceFeignClient.CryptoPreference> preferences = preferenceClient.getUserPreferences(authHeader);
        List<String> symbols = preferences.stream()
                .map(PreferenceFeignClient.CryptoPreference::getCryptoName)
                .toList();

        return Flux.fromIterable(symbols)
                .flatMap(symbol ->
                        getAveragesForSymbolByPeriod(symbol, period, range)
                                .map(avgMap -> Tuples.of(symbol, avgMap))
                )
                .collectMap(Tuple2::getT1, Tuple2::getT2);
    }

    public Mono<Map<String, Double>> getAveragesForSymbolByPeriod(String symbol, String period, int range) {
        TemporalUnit unit;
        String interval;

        switch (period.toLowerCase()) {
            case "month" -> {
                unit = ChronoUnit.MONTHS;
                interval = "1d";
            }
            case "week" -> {
                unit = ChronoUnit.WEEKS;
                interval = "1d";
            }
            case "day" -> {
                unit = ChronoUnit.DAYS;
                interval = "1d";
            }
            default -> { // year
                unit = ChronoUnit.YEARS;
                interval = "1w"; // ⬅ plus large pour bien couvrir 4 ans
            }
        }

        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime startDate = now.minus(range, unit);
        long start = startDate.toInstant().toEpochMilli();
        long end = now.toInstant().toEpochMilli();

        return binanceService.getHistoricalData(symbol, interval, start, end)
                .map(klineArray -> {
                    Map<String, List<Double>> buckets = new HashMap<>();

                    for (Object obj : klineArray) {
                        List<Object> kline = (List<Object>) obj;
                        long timestamp = Long.parseLong(kline.get(0).toString());
                        double close = Double.parseDouble(kline.get(4).toString());

                        LocalDate date = Instant.ofEpochMilli(timestamp).atZone(ZoneOffset.UTC).toLocalDate();

                        String key = switch (period.toLowerCase()) {
                            case "month" -> date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                            case "week" -> date.getYear() + "-W" + String.format("%02d", date.get(WeekFields.ISO.weekOfWeekBasedYear()));
                            case "day" -> date.toString();
                            default -> String.valueOf(date.getYear());
                        };

                        buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(close);
                    }

                    Map<String, Double> averages = new TreeMap<>();
                    for (Map.Entry<String, List<Double>> entry : buckets.entrySet()) {
                        List<Double> values = entry.getValue();
                        double avg = values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
                        averages.put(entry.getKey(), avg);
                    }

                    // ✅ Limiter aux N dernières périodes (ex: 4 dernières années/mois/semaines)
                    return averages.entrySet().stream()
                            .sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
                            .limit(range)
                            .collect(Collectors.toMap(
                                    Map.Entry::getKey,
                                    Map.Entry::getValue,
                                    (a, b) -> a,
                                    TreeMap::new
                            ));
                });
    }



}


