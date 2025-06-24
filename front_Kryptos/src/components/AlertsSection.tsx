import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getToken } from "../services/authService";

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

interface AlertsSectionProps {
  alerts: any[];
  setAlerts: (alerts: any[]) => void;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, setAlerts }) => {
  const [open, setOpen] = useState(false);
  const [crypto, setCrypto] = useState("BTC");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("BELOW");
  const [error, setError] = useState("");
  const [editAlert, setEditAlert] = useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    alertId: number | null;
  }>({ open: false, alertId: null });
  const userId = 1;

  const fetchAlerts = () => {
    const token = getToken();
    fetch("http://localhost:9999/alerts", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAddOrEdit = async () => {
    if (!price || isNaN(Number(price))) {
      setError("Prix invalide");
      return;
    }
    const body = {
      cryptoSymbol: crypto,
      targetPrice: Number(price),
      condition,
      userId,
    };
    const token = getToken();
    if (editAlert) {
      // Modification (PUT)
      await fetch(`http://localhost:9999/alerts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...body,
          old: {
            cryptoSymbol: editAlert.cryptoSymbol,
            targetPrice: editAlert.targetPrice,
            condition: editAlert.condition,
            userId,
          },
        }),
      });
    } else {
      // Ajout (POST)
      await fetch("http://localhost:9999/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
    }
    setOpen(false);
    setCrypto("BTC");
    setPrice("");
    setCondition("BELOW");
    setError("");
    setEditAlert(null);
    fetchAlerts();
  };

  const handleDelete = async (alertID: number) => {
    setDeleteDialog({ open: true, alertId: alertID });
  };

  const confirmDelete = async () => {
    if (deleteDialog.alertId == null) return;
    const token = getToken();
    await fetch(`http://localhost:9999/alerts/${deleteDialog.alertId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setDeleteDialog({ open: false, alertId: null });
    fetchAlerts();
  };

  const handleEdit = (alert: any) => {
    setEditAlert(alert);
    setCrypto(alert.cryptoSymbol);
    setPrice(alert.targetPrice.toString());
    setCondition(alert.condition);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        mt: 4,
        bgcolor: "#181c24",
        borderRadius: 2,
        p: 2,
        color: "#fff",
        maxWidth: 420,
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", flex: 1 }}>
          Mes alertes
        </Typography>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            ml: 1,
            borderRadius: 1,
            width: 32,
            height: 32,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <List dense>
        {alerts.length === 0 && (
          <ListItem>
            <ListItemText
              primary={<span style={{ color: "#aaa" }}>Aucune alerte</span>}
            />
          </ListItem>
        )}
        {alerts.map((a, idx) => (
          <ListItem
            key={a.id || a.cryptoSymbol + a.targetPrice + a.condition + idx}
            sx={{ borderBottom: "1px solid #23272f" }}
          >
            <ListItemText
              primary={
                <span>
                  {a.cryptoSymbol} &nbsp;
                  <span style={{ color: "#fdd835", fontWeight: 600 }}>
                    {a.condition === "BELOW" ? "≤" : "≥"} {a.targetPrice}
                  </span>
                </span>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                color="primary"
                size="small"
                onClick={() => handleEdit(a)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                size="small"
                onClick={() => handleDelete(a.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditAlert(null);
        }}
      >
        <DialogTitle>
          {editAlert ? "Modifier l'alerte" : "Ajouter une alerte"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Crypto"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {CRYPTOS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Prix déclencheur"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
          <TextField
            select
            label="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          >
            <MenuItem value="BELOW">En dessous</MenuItem>
            <MenuItem value="ABOVE">Au dessus</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditAlert(null);
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleAddOrEdit} variant="contained">
            {editAlert ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, alertId: null })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer cette alerte&nbsp;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, alertId: null })}
          >
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertsSection;
