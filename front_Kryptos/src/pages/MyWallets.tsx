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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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

interface Transaction {
  type: string;
  amount: number;
  symbol: string;
  timestamp: string;
}

export default function MyWallets() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [copied, setCopied] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const fetchWalletData = () => {
    axios
      .get<Wallet>("http://localhost:9090/wallet/1")
      .then((res) => setWallet(res.data))
      .catch((err) => console.error(err));
  };

  const fetchTransactions = () => {
    axios
      .get<Transaction[]>("http://localhost:9090/wallet/1/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));

    fetchWalletData(); // <- on rafraîchit aussi le solde à chaque intervalle
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();

    const interval = setInterval(fetchTransactions, 5000);
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
      .catch((err) =>
        console.error("Erreur lors de la mise à jour de l'adresse :", err)
      );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "black",
        p: 4,
        background: "linear-gradient(to bottom right, #f0f3f8, #dce6f5)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 4 }}
      >
        <WalletIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Ma Wallet
      </Typography>

      {wallet && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              maxWidth: 700,
              mx: "auto",
              p: 4,
              backgroundColor: "#fff",
              borderRadius: 4,
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Solde total
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                {wallet.balance}
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.8em',
                    marginLeft: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  }}
                >
                  $
                </Box>
              </Box>
            </Typography>

            <Box sx={{ borderBottom: "1px solid #ccc", my: 3 }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <CreditCardIcon />
              <Typography>
                Adresse ETH :
                <span style={{ marginLeft: 8 }}>
                  {wallet.linkedEthAddress || "Non liée"}
                </span>
              </Typography>
              {wallet.linkedEthAddress && (
                <Tooltip title={copied ? "Copié !" : "Copier l'adresse"}>
                  <IconButton
                    onClick={() => handleCopy(wallet.linkedEthAddress!)}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            {!wallet.linkedEthAddress && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Adresse ETH"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLinkAddress}
                >
                  VALIDER
                </Button>
              </Stack>
            )}

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ mt: 2 }}
            >
              <LockIcon sx={{ color: "orange" }} />
              <Typography>
                Solde sur la blockchain :
                <strong style={{ marginLeft: 8 }}>
                  {wallet.ethBalanceOnChain ?? "N/A"} ETH
                </strong>
              </Typography>
            </Stack>
          </Card>
        </motion.div>
      )}

      <Typography variant="h5" align="center" gutterBottom>
        Dernières transactions
      </Typography>

      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          mt: 2,
          maxHeight: "300px",
          overflowY: "auto",
          pr: 1,
        }}
      >
        {transactions.length === 0 && (
          <Typography align="center" sx={{ mt: 2, color: "#666" }}>
            Aucune transaction pour le moment.
          </Typography>
        )}

        {transactions.map((tx, index) => (
          <Card
            key={index}
            sx={{
              bgcolor: "#f9f9f9",
              color: "#000",
              p: 2,
              borderRadius: 3,
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <CryptoIcon symbol={tx.symbol} size={24} />
              <Typography>
                {tx.type === "BUY_CRYPTO" ? "Achat" : tx.type}
              </Typography>
              <Typography fontWeight="bold">– {tx.symbol}</Typography>
            </Stack>

            <Stack alignItems="flex-end">
              <Typography fontSize={14} sx={{ color: "#666" }}>
                {new Date(tx.timestamp).toLocaleString("fr-FR")}
              </Typography>
              <Typography fontWeight="bold">
                {tx.amount}
                <span style={{ fontSize: "0.75em", marginLeft: 2 }}>$</span>
              </Typography>
            </Stack>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
