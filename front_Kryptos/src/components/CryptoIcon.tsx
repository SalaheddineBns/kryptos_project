import React from "react";
import { Avatar } from "@mui/material";

interface Props {
  symbol: string;
  size?: number;
}

const icons: { [key: string]: string } = {
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  BNB: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=026",
  XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026",
  TONIC: "https://cryptologos.cc/logos/tonic-logo.png", // Ajoute une image valide
};

const CryptoIcon = ({ symbol, size = 32 }: Props) => {
  const src = icons[symbol] || "https://via.placeholder.com/32";
  return (
    <Avatar
      src={src}
      alt={symbol}
      sx={{ width: size, height: size }}
      variant="circular"
    />
  );
};

export default CryptoIcon;
