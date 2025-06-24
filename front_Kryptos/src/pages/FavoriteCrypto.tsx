import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import AddIcon from "@mui/icons-material/Add";
import { getToken } from "../services/authService";
import { getUserIdFromToken } from "../utils/auth";

const CRYPTOS = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "ADA",
  "DOGE",
  "AVAX",
  "TRX",
];

interface FavoriteCryptoProps {
  favorites: string[];
  setFavorites: (favs: string[]) => void;
}

const FavoriteCrypto: React.FC<FavoriteCryptoProps> = ({
  favorites,
  setFavorites,
}) => {
  const [favoritesList, setFavoritesList] = useState<
    {
      cryptoName: string;
      interestLevel: number;
    }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [interest, setInterest] = useState(3);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    crypto: string | null;
  }>({ open: false, crypto: null });
  const userId = getUserIdFromToken();

  // Charger les préférences au chargement
  useEffect(() => {
    const token = getToken();
    fetch("http://localhost:8888/preferences/crypto", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        const favs = Array.isArray(data)
          ? data.map((f: any) => f.cryptoName)
          : [];
        setFavorites(favs);
        setFavoritesList(data);
      })
      .catch(() => {
        setFavorites([]);
        setFavoritesList([]);
      });
  }, [setFavorites]);

  const handleAdd = async () => {
    const body = {
      userId,
      cryptoName: selectedCrypto,
      interestLevel: interest,
    };
    const token = getToken();
    const res = await fetch("http://localhost:8888/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setFavorites((prev) => [
        ...prev.filter((f) => f !== selectedCrypto),
        selectedCrypto,
      ]);
      setFavoritesList((prev) => [
        ...prev.filter((f) => f.cryptoName !== selectedCrypto),
        { cryptoName: selectedCrypto, interestLevel: interest },
      ]);
      setOpen(false);
      setSelectedCrypto("BTC");
      setInterest(3);
    }
  };

  // Suppression via API (nouvelle route avec nom de la crypto)
  const handleDelete = async (crypto: string) => {
    setConfirmDelete({ open: true, crypto });
  };

  const confirmDeleteCrypto = async () => {
    if (!confirmDelete.crypto || !userId) return;
    const token = getToken();
    const cryptoName = confirmDelete.crypto.toLowerCase();
    const res = await fetch(
      `http://localhost:8888/preferences/crypto/${userId}/${cryptoName}`,
      {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (res.ok) {
      // Recharge la liste depuis l'API pour être sûr
      const favRes = await fetch("http://localhost:8888/preferences/crypto", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await favRes.json();
      const favs = Array.isArray(data)
        ? data.map((f: any) => f.cryptoName)
        : [];
      setFavorites(favs);
      setFavoritesList(data);
    }
    setConfirmDelete({ open: false, crypto: null });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StarIcon sx={{ color: "#fdd835" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#fff", letterSpacing: 0.5 }}
          >
            Favorites
          </Typography>
        </Box>

        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            "&:hover": { bgcolor: "#1565c0" },
            borderRadius: 1,
            width: 36,
            height: 36,
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "#181c24",
          color: "#fff",
          borderRadius: 2,
          overflow: "hidden", // ✅ pas de scroll
        }}
      >
        <Table
          size="small" // ✅ rend le tableau plus compact
          sx={{
            width: "100%",
            tableLayout: "fixed", // ✅ évite débordement
          }}
        >
          <TableHead>
            <TableRow sx={{ background: "#23272f" }}>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  width: "30%",
                  whiteSpace: "nowrap",
                }}
              >
                Crypto
              </TableCell>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  width: "40%",
                  whiteSpace: "nowrap",
                }}
              >
                Intérêt
              </TableCell>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  width: "30%",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favoritesList.map((fav) => (
              <TableRow key={fav.cryptoName}>
                <TableCell sx={{ color: "#fff" }}>{fav.cryptoName}</TableCell>
                <TableCell>
                  <Rating
                    value={fav.interestLevel}
                    max={5}
                    readOnly
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(fav.cryptoName)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {favoritesList.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: "#aaa" }}>
                  Aucune crypto favorite pour l'instant.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour ajouter une crypto favorite */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter une crypto favorite</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="crypto-select-label">Crypto</InputLabel>
            <Select
              labelId="crypto-select-label"
              value={selectedCrypto}
              label="Crypto"
              onChange={(e) => setSelectedCrypto(e.target.value as string)}
            >
              {CRYPTOS.map((crypto) => (
                <MenuItem key={crypto} value={crypto}>
                  {crypto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography gutterBottom>Niveau d'intérêt</Typography>
          <Rating
            value={interest}
            max={5}
            onChange={(_, value) => setInterest(value || 1)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleAdd} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, crypto: null })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer cette crypto favorite&nbsp;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, crypto: null })}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteCrypto}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FavoriteCrypto;
