import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { motion } from "framer-motion";
import CryptoIcon from "../components/CryptoIcon";

interface Wallet {
  id: number;
  userId: number;
  balance: number;
  linkedEthAddress: string | null;
  ethBalanceOnChain: number | null;
}

interface EthTransaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: string;
}

export default function MyWallets() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<EthTransaction[]>([]);
  const [copied, setCopied] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "send" | "receive">("all");

  const fetchWalletData = () => {
    axios
      .get<Wallet>("http://localhost:9090/wallet/1")
      .then((res) => setWallet(res.data))
      .catch((err) => console.error(err));
  };

  const fetchTransactions = () => {
    axios
      .get<EthTransaction[]>("http://localhost:9090/wallet/1/eth-transactions")
      .then((res) => {
        const sortedTxs = res.data
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 15);
        setTransactions(sortedTxs);
      })
      .catch((err) => console.error("Erreur récupération transactions ETH", err));
  };

  const fetchEthPrice = () => {
    axios
      .get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      .then((res) => setEthPrice(res.data.ethereum.usd))
      .catch((err) => console.error("Erreur récupération prix ETH", err));
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
    fetchEthPrice();

    const interval = setInterval(() => {
      fetchTransactions();
      fetchEthPrice();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkAddress = () => {
    if (!wallet || !newAddress) return;

    axios
      .put(`http://localhost:9090/wallet/${wallet.id}/link-address`, {
        ethAddress: newAddress,
      })
      .then(() => {
        fetchWalletData();
        setNewAddress("");
      })
      .catch((err) => console.error("Erreur mise à jour adresse ETH", err));
  };

  const handleFilterChange = (_event: any, newFilter: "all" | "send" | "receive") => {
    if (newFilter) setFilter(newFilter);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (!wallet?.linkedEthAddress) return true;
    const isSent = tx.from.toLowerCase() === wallet.linkedEthAddress.toLowerCase();
    if (filter === "send") return isSent;
    if (filter === "receive") return !isSent;
    return true;
  });

  return (
    <Box sx={{ minHeight: "100vh", color: "black", p: 4, background: "linear-gradient(to bottom right, #f0f3f8, #dce6f5)" }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        <WalletIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Ma Wallet
      </Typography>

      {wallet && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card sx={{ maxWidth: 700, mx: "auto", p: 4, backgroundColor: "#fff", borderRadius: 4, boxShadow: "0 0 20px rgba(0,0,0,0.1)", textAlign: "center", mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Solde blockchain (ETH)
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {wallet.ethBalanceOnChain?.toFixed(6)} ETH
            </Typography>

            {ethPrice && wallet.ethBalanceOnChain !== null && (
              <Typography variant="h6" sx={{ color: "#555", mb: 2 }}>
                ≈ {(wallet.ethBalanceOnChain * ethPrice).toFixed(2)} $
              </Typography>
            )}

            <Box sx={{ borderBottom: "1px solid #ccc", my: 3 }} />

            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
              <CreditCardIcon />
              <Typography>
                Adresse ETH :
                <span style={{ marginLeft: 8 }}>
                  {wallet.linkedEthAddress || "Non liée"}
                </span>
              </Typography>
              {wallet.linkedEthAddress && (
                <Tooltip title={copied ? "Copié !" : "Copier l'adresse"}>
                  <IconButton onClick={() => handleCopy(wallet.linkedEthAddress!)} size="small">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            {!wallet.linkedEthAddress && (
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <TextField size="small" variant="outlined" placeholder="Adresse ETH" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                <Button variant="contained" color="primary" onClick={handleLinkAddress}>
                  VALIDER
                </Button>
              </Stack>
            )}
          </Card>
        </motion.div>
      )}

      <Typography variant="h5" align="center" gutterBottom>
        Dernières transactions blockchain (ETH)
      </Typography>

      <Box sx={{ textAlign: "center", mt: 1 }}>
        <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange} size="small">
          <ToggleButton value="all">Toutes</ToggleButton>
          <ToggleButton value="send">Envois</ToggleButton>
          <ToggleButton value="receive">Réceptions</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto", mt: 2, maxHeight: "300px", overflowY: "auto", pr: 1 }}>
        {filteredTransactions.length === 0 && (
          <Typography align="center" sx={{ mt: 2, color: "#666" }}>
            Aucune transaction pour ce filtre.
          </Typography>
        )}

        {filteredTransactions.map((tx, index) => {
          const isSent = tx.from.toLowerCase() === wallet?.linkedEthAddress?.toLowerCase();
          const direction = isSent ? "Envoi" : "Réception";
          const directionColor = isSent ? "red" : "green";
          const address = isSent ? tx.to : tx.from;

          return (
            <Card key={index} sx={{ bgcolor: "#f9f9f9", color: "#000", p: 2, borderRadius: 3, boxShadow: "0 0 10px rgba(0,0,0,0.05)", mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CryptoIcon symbol="ETH" size={24} />
                <Typography fontWeight="bold" sx={{ color: directionColor }}>
                  {direction}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>{address.slice(0, 10)}...</Typography>
              </Stack>

              <Stack alignItems="flex-end">
                <Typography fontSize={14} sx={{ color: "#666" }}>
                  {new Date(tx.timestamp).toLocaleString("fr-FR")}
                </Typography>
                <Typography fontWeight="bold">
                  {Number(tx.value).toFixed(5)} <span style={{ fontSize: "0.75em" }}>ETH</span>
                </Typography>
              </Stack>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
