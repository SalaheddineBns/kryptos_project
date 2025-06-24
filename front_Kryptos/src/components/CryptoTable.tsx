import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";

interface CryptoTableProps {
  data: Array<{ service: string; data: any }>;
  loading?: boolean;
}

// Helper pour extraire dynamiquement toutes les cryptos présentes dans les données
function getAllCryptos(data: Array<{ service: string; data: any }>) {
  const cryptoSet = new Set<string>();
  data.forEach((serviceData) => {
    if (serviceData.service === "Binance") {
      serviceData.data.forEach((item: any) => {
        // On ne prend que les paires en USDT pour éviter les doublons
        if (item.symbol.endsWith("USDT")) {
          cryptoSet.add(item.symbol.replace("USDT", ""));
        }
      });
    } else if (serviceData.service === "Coinbase") {
      const rates = serviceData.data.data?.rates;
      if (rates) {
        Object.keys(rates).forEach((symbol) => {
          // On ne prend que les symboles en majuscules et de 2 à 6 lettres
          if (/^[A-Z0-9]{2,6}$/.test(symbol)) {
            cryptoSet.add(symbol);
          }
        });
      }
    }
    // Ajouter ici d'autres services si besoin
  });
  return Array.from(cryptoSet).sort();
}

// Helper pour extraire les prix par service/crypto
function getCryptoRows(data: Array<{ service: string; data: any }>) {
  const mostWanted = ["BTC", "ETH", "BNB", "SOL", "XRP"];
  const cryptos = getAllCryptos(data).filter((c) => mostWanted.includes(c));
  // Trie selon l'ordre de mostWanted
  cryptos.sort((a, b) => mostWanted.indexOf(a) - mostWanted.indexOf(b));
  const rows = cryptos.map((crypto) => {
    const row: any = { crypto };
    let priceUSD = 0;
    data.forEach((serviceData) => {
      if (serviceData.service === "Binance") {
        const found = serviceData.data.find(
          (item: any) => item.symbol === crypto + "USDT"
        );
        if (found) {
          row.Binance = Number(found.price);
          priceUSD = Math.max(priceUSD, Number(found.price));
        } else {
          row.Binance = null;
        }
      } else if (serviceData.service === "Coinbase") {
        const rates = serviceData.data.data?.rates;
        console.log("DEBUG Coinbase", {
          crypto,
          rates,
          value: rates?.[crypto],
        });
        if (rates && rates[crypto]) {
          const val = Number(rates[crypto]);
          row.Coinbase = val;
          priceUSD = Math.max(priceUSD, val);
        } else {
          row.Coinbase = null;
        }
      } else {
        row[serviceData.service] = null;
      }
    });
    row.priceUSD = priceUSD;
    return row;
  });
  return rows;
}

// Utilitaire pour obtenir l'URL du logo CoinGecko à partir du symbole
const getCoinGeckoLogo = (symbol: string) => {
  const mapping: Record<string, string> = {
    BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
    SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    XRP: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    USDT: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    ADA: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    DOGE: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    AVAX: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png",
    TRX: "https://assets.coingecko.com/coins/images/1094/large/tron.png",
  };
  return mapping[symbol.toUpperCase()] || null;
};

const defaultLogo =
  "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png";

const coinLogos: Record<string, string> = {
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=030",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=030",
  BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=030",
  XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=030",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png?v=030",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=030",
  ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=030",
  DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=030",
  AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png?v=030",
  TRX: "https://cryptologos.cc/logos/tron-trx-logo.png?v=030",
  // Ajoute d'autres logos si besoin
};

const CryptoTable: React.FC<CryptoTableProps> = ({ data, loading }) => {
  const services = data.map((d) => d.service);
  const rows = getCryptoRows(data);

  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: "#181c24",
        color: "white",
        border: "1px solid #23272f",
        borderRadius: "16px",
        overflow: "auto",
        boxShadow: 3,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="crypto table">
          <TableHead>
            <TableRow sx={{ background: "#23272f" }}>
              <TableCell
                sx={{
                  color: "#fff",
                  borderBottom: "2px solid #2d3139",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  position: "sticky",
                  left: 0,
                  background: "#23272f",
                  zIndex: 2,
                }}
              >
                Crypto
              </TableCell>
              {services.map((service) => (
                <TableCell
                  key={service}
                  sx={{
                    color: "#90caf9",
                    borderBottom: "2px solid #2d3139",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textAlign: "center",
                    background: "#23272f",
                  }}
                >
                  {service}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={row.crypto}
                sx={{
                  background: idx % 2 === 0 ? "#181c24" : "#23272f",
                  transition: "background 0.2s",
                  "&:hover": { background: "#222b38" },
                }}
              >
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "1px solid #23272f",
                    borderRight: "1px solid #23272f",
                    borderRadius: "8px 0 0 8px",
                    background: "inherit",
                  }}
                >
                  <img
                    src={getCoinGeckoLogo(row.crypto) || defaultLogo}
                    alt={row.crypto}
                    style={{
                      width: 28,
                      height: 28,
                      marginRight: 8,
                      borderRadius: 6,
                      background: "#fff",
                    }}
                    onError={(e) => (e.currentTarget.src = defaultLogo)}
                  />
                  <span>{row.crypto}</span>
                </TableCell>
                {services.map((service) => (
                  <TableCell
                    key={service}
                    sx={{
                      color: row[service] !== null ? "#fff" : "#888",
                      fontWeight: 500,
                      textAlign: "center",
                      borderBottom: "1px solid #23272f",
                      background: "inherit",
                    }}
                  >
                    {row[service] !== null && row[service] !== undefined
                      ? Number(row[service]).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: service === "Coinbase" ? 2 : 8,
                          minimumFractionDigits: service === "Coinbase" ? 2 : 2,
                        })
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default CryptoTable;
