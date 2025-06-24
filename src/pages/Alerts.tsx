import React, { useEffect, useState } from "react";
import { fetchAlerts, addAlert, deleteAlert } from "../services/cryptoApis";
import { getToken } from "../services/authService";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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
const CONDITIONS = ["ABOVE", "BELOW"];

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [cryptoSymbol, setCryptoSymbol] = useState("BTC");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState("BELOW");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    alertId: number | null;
  }>({ open: false, alertId: null });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    fetchAlerts(token)
      .then(setAlerts)
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userEmail = payload.sub || payload.email;
      await addAlert(
        {
          userEmail,
          cryptoSymbol,
          targetPrice: Number(targetPrice),
          condition,
        },
        token
      );
      setSuccess("Alerte ajoutée !");
      setTargetPrice("");
      fetchAlerts(token)
        .then((data) => setAlerts(data))
        .catch(() => {
          setError("Alerte ajoutée, mais la liste n'a pas pu être rafraîchie.");
          setTimeout(() => setError(""), 2000);
        });
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Erreur lors de l'ajout de l'alerte");
      setTimeout(() => setError(""), 2000);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token) return;
    try {
      await deleteAlert(alertId, token);
      setSuccess("Alerte supprimée !");
      fetchAlerts(token)
        .then((data) => setAlerts(data))
        .catch(() => {
          setError(
            "Alerte supprimée, mais la liste n'a pas pu être rafraîchie."
          );
          setTimeout(() => setError(""), 2000);
        });
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Erreur lors de la suppression de l'alerte");
      setTimeout(() => setError(""), 2000);
    }
  };

  const handleAskDelete = (alertId: number) => {
    setConfirmDelete({ open: true, alertId });
  };
  const handleCloseDialog = () => {
    setConfirmDelete({ open: false, alertId: null });
  };
  const handleConfirmDelete = async () => {
    if (confirmDelete.alertId == null) return;
    await handleDeleteAlert(confirmDelete.alertId);
    setConfirmDelete({ open: false, alertId: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes alertes
      </Typography>
      <Card sx={{ maxWidth: 500, mb: 3, bgcolor: "#23272f", color: "#fff" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ajouter une alerte
          </Typography>
          <form onSubmit={handleAddAlert}>
            <TextField
              select
              label="Crypto"
              value={cryptoSymbol}
              onChange={(e) => setCryptoSymbol(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff", background: "#181c24" } }}
            >
              {CRYPTOS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Prix cible"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff", background: "#181c24" } }}
            />
            <TextField
              select
              label="Condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff", background: "#181c24" } }}
            >
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#1976d2",
                color: "#fff",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Ajouter l'alerte
            </Button>
          </form>
        </CardContent>
      </Card>
      <TableContainer
        component={Paper}
        sx={{ bgcolor: "#181c24", color: "#fff" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#23272f" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Crypto
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Prix cible
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Condition
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((a, i) => (
              <TableRow key={a.id || i}>
                <TableCell sx={{ color: "#fff" }}>{a.cryptoSymbol}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{a.targetPrice}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{a.condition}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{a.userEmail}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => handleAskDelete(a.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {alerts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#aaa" }}>
                  Aucune alerte pour l'instant.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={confirmDelete.open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer cette alerte&nbsp;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleConfirmDelete}
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

export default Alerts;
