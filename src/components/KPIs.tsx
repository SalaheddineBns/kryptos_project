import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface KPIsProps {
  favorites: string[];
  alerts: any[];
  chartData?: any;
}

const getBestPerformance = (chartData: any) => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0)
    return null;
  let best = null;
  let bestPerf = -Infinity;
  chartData.datasets.forEach((ds: any) => {
    const data = ds.data;
    if (data.length > 1) {
      const perf = ((data[data.length - 1] - data[0]) / data[0]) * 100;
      if (perf > bestPerf) {
        bestPerf = perf;
        best = { label: ds.label, perf };
      }
    }
  });
  return best;
};

const KPIs: React.FC<KPIsProps> = ({ favorites, alerts, chartData }) => {
  const best = getBestPerformance(chartData);
  return (
    <Box sx={{ display: "flex", gap: 2, my: 3 }}>
      <Paper
        sx={{
          p: 2,
          minWidth: 120,
          bgcolor: "#23272f",
          color: "#fff",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2">Cryptos favorites</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {favorites.length}
        </Typography>
      </Paper>
      <Paper
        sx={{
          p: 2,
          minWidth: 120,
          bgcolor: "#23272f",
          color: "#fff",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2">Alertes actives</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {alerts.length}
        </Typography>
      </Paper>
      <Paper
        sx={{
          p: 2,
          minWidth: 180,
          bgcolor: "#23272f",
          color: "#fff",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2">Meilleure perf.</Typography>
        {best ? (
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {best.label} ({best.perf > 0 ? "+" : ""}
            {best.perf.toFixed(1)}%)
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: "#bbb" }}>
            N/A
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default KPIs;
