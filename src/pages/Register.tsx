import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register, isAuthenticated } from "../services/authService";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from "@mui/material";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(email, password);
      setSuccess("Inscription réussie, vous pouvez vous connecter.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError("Erreur lors de l'inscription");
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left branding panel */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: "url(/assets/login-bg.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              mt: 2,
            }}
          >
            CRYPTOWATCH
            <br />
            CENTRALIZE YOUR DATA
          </Typography>
        </Box>
      </Grid>

      {/* Right form panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f6fa",
          p: 4,
        }}
      >
        <Card
          sx={{ maxWidth: 400, width: "100%", borderRadius: 2, boxShadow: 4 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Créer un compte
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                variant="outlined"
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
              >
                S'inscrire
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Déjà un compte ?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/login")}
                    sx={{ fontWeight: "bold" }}
                  >
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;
