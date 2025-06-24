import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface WalletCardProps {
  balance: number;
  linkedEthAddress: string | null;
  ethBalanceOnChain: number | null;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  linkedEthAddress,
  ethBalanceOnChain,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          background: "#1e1e1e",
          color: "#fff",
          mt: 4,
          p: 2,
          boxShadow: 5,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💼 Mon Wallet
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>💰 Solde interne :</strong> {balance} $
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>🔗 Adresse ETH :</strong>{" "}
            {linkedEthAddress || "Non liée"}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>⛓️ Solde sur la blockchain :</strong>{" "}
            {ethBalanceOnChain !== null ? `${ethBalanceOnChain} ETH` : "N/A"}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletCard;
