import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CryptoTable from "../components/CryptoTable";
import { fetchMarketData } from "../services/cryptoApis"; // <-- utilise ta fonction backend ici
import Chatbot from "../components/Chatbot";
import FavoriteCrypto from "../pages/FavoriteCrypto";
import { Card, CardContent, Typography } from "@mui/material";
import AlertsSection from "../components/AlertsSection";
import ChartPreferences from "../components/ChartPreferences";
import KPIs from "../components/KPIs";

const Dashboard = () => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Les 5 cryptos les plus reconnues
        const symbols = ["BTC", "ETH", "BNB", "SOL", "XRP"];
        const results = await Promise.all(
          symbols.map((symbol) => fetchMarketData(symbol))
        );
        setCryptoData([
          {
            service: "Binance",
            data: results.map((response, idx) => ({
              symbol: symbols[idx] + "USDT",
              price: response.binance.price,
            })),
          },
          {
            service: "Coinbase",
            data: {
              data: {
                rates: symbols.reduce(
                  (acc, symbol, idx) => {
                    acc[symbol] = 1; // Pour compatibilité avec CryptoTable
                    acc["USD" + symbol] = responseForCoinbaseUSD(results[idx]);
                    return acc;
                  },
                  { USD: results[0].coinbase.data.amount }
                ),
              },
            },
          },
        ]);
      } catch (e) {
        console.error("Erreur lors du chargement :", e);
        setCryptoData([]);
      } finally {
        setLoading(false);
      }
    }
    // Helper pour extraire le prix USD de Coinbase
    function responseForCoinbaseUSD(coinbaseResp: any) {
      return coinbaseResp.coinbase.data.amount;
    }
    loadData();
  }, []);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#121212", p: 3 }}>
      <Container maxWidth="lg">
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          <div style={{ flex: 1.2, display: "flex", flexDirection: "column" }}>
            <CryptoTable
              data={cryptoData}
              loading={loading}
              tableSx={{ borderRadius: 2 }}
            />
            <AlertsSection alerts={alerts} setAlerts={setAlerts} />
            <KPIs favorites={favorites} alerts={alerts} chartData={chartData} />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card
              sx={{
                bgcolor: "#23272f",
                color: "#fff",
                boxShadow: 4,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Mes cryptos favorites
                </Typography>
                <FavoriteCrypto
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </CardContent>
            </Card>
            <ChartPreferences setChartData={setChartData} />
          </div>
        </div>
      </Container>
      {/* Ajout du chatbot en bas à droite */}
      <Chatbot />
    </Box>
  );
};

export default Dashboard;
