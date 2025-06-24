import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { getToken } from "../services/authService";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

const periods = [
  { label: "Jour", value: "day", defaultRange: 30 },
  { label: "Mois", value: "month", defaultRange: 7 },
  { label: "Année", value: "year", defaultRange: 4 },
];

interface ChartPreferencesProps {
  setChartData: (data: any) => void;
}

const ChartPreferences: React.FC<ChartPreferencesProps> = ({
  setChartData,
}) => {
  const [period, setPeriod] = useState("day");
  const [range, setRange] = useState(30);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [period, range]);

  const fetchData = async () => {
    setLoading(true);
    setData(null);
    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:8999/api/market/history/preferences?period=${period}&range=${range}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const json = await res.json();
      setData(json);
      // Préparer les données pour Chart.js et lever au parent
      if (json && Object.keys(json).length > 0) {
        const labels = Object.values(json)[0]
          ? Object.keys(Object.values(json)[0])
          : [];
        const chartDataObj = {
          labels,
          datasets: Object.entries(json).map(([crypto, values]: any, idx) => ({
            label: crypto.toUpperCase(),
            data: labels.map((label: string) => values[label]),
            borderColor: idx === 0 ? "#1976d2" : "#fdd835",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            tension: 0.3,
            pointRadius: 2,
          })),
        };
        setChartData(chartDataObj);
      } else {
        setChartData(null);
      }
    } catch (e) {
      setData(null);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  // Préparer les données pour Chart.js
  let chartData: any = null;
  let xLabel = "";
  if (data && Object.keys(data).length > 0) {
    const labels = Object.values(data)[0]
      ? Object.keys(Object.values(data)[0])
      : [];
    chartData = {
      labels,
      datasets: Object.entries(data).map(([crypto, values]: any, idx) => ({
        label: crypto.toUpperCase(),
        data: labels.map((label: string) => values[label]),
        borderColor: idx === 0 ? "#1976d2" : "#fdd835",
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        tension: 0.3,
        pointRadius: 2,
      })),
    };
    if (period === "day") xLabel = "Date";
    else if (period === "month") xLabel = "Mois";
    else if (period === "year") xLabel = "Année";
  }

  return (
    <Box
      sx={{
        mt: 4,
        bgcolor: "#181c24",
        borderRadius: 2,
        p: 2,
        color: "#fff",
        maxWidth: 700,
        width: "100%",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        Statistiques sur mes cryptos favorites
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            "& .MuiInputBase-root": { bgcolor: "#23272f", color: "#fff" },
            "& .MuiInputLabel-root": { color: "#bbb" },
          }}
        >
          <InputLabel sx={{ color: "#bbb" }}>Période</InputLabel>
          <Select
            value={period}
            label="Période"
            onChange={(e) => {
              setPeriod(e.target.value);
              const found = periods.find((p) => p.value === e.target.value);
              if (found) setRange(found.defaultRange);
            }}
            sx={{ color: "#fff" }}
            MenuProps={{
              PaperProps: { sx: { bgcolor: "#23272f", color: "#fff" } },
            }}
          >
            {periods.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{
            minWidth: 100,
            "& .MuiInputBase-root": { bgcolor: "#23272f", color: "#fff" },
            "& .MuiInputLabel-root": { color: "#bbb" },
          }}
        >
          <InputLabel sx={{ color: "#bbb" }}>Range</InputLabel>
          <Select
            value={range}
            label="Range"
            onChange={(e) => setRange(Number(e.target.value))}
            sx={{ color: "#fff" }}
            MenuProps={{
              PaperProps: { sx: { bgcolor: "#23272f", color: "#fff" } },
            }}
          >
            {[...Array(15).keys()].map((i) => {
              const val =
                period === "day"
                  ? 10 + i * 5
                  : period === "month"
                  ? 2 + i
                  : 1 + i;
              return (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={fetchData}
          sx={{
            ml: 1,
            bgcolor: "#1976d2",
            color: "#fff",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Actualiser
        </Button>
      </Box>
      {loading && (
        <CircularProgress
          color="primary"
          size={32}
          sx={{ display: "block", mx: "auto", my: 4 }}
        />
      )}
      {!loading && chartData && (
        <Box sx={{ width: "100%", minHeight: 250 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: "#fff" } },
                tooltip: { enabled: true },
                title: {
                  display: true,
                  text: `Évolution (${xLabel} / Valeur $)`,
                  color: "#fff",
                  font: { size: 16, weight: "bold" },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: xLabel,
                    color: "#fff",
                    font: { size: 13, weight: "bold" },
                  },
                  ticks: { color: "#fff" },
                  grid: { color: "#333" },
                },
                y: {
                  title: {
                    display: true,
                    text: "Valeur ($)",
                    color: "#fff",
                    font: { size: 13, weight: "bold" },
                  },
                  ticks: { color: "#fff" },
                  grid: { color: "#333" },
                  beginAtZero: false,
                },
              },
            }}
          />
        </Box>
      )}
      {!loading && !chartData && (
        <Typography align="center" sx={{ color: "#aaa", mt: 2 }}>
          Aucune donnée à afficher.
        </Typography>
      )}
    </Box>
  );
};

export default ChartPreferences;
