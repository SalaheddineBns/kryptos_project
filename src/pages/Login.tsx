import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
} from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password, remember);
      console.log("Login OK", data);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erreur de login", err);
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left panel with branding/image */}
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

      {/* Right panel with form */}
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
              Connexion
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
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

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Se souvenir de moi"
                />
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/forgot-password")}
                  type="button"
                >
                  Mot de passe oublié?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
              >
                Se connecter
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Pas de compte?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/register")}
                    sx={{ fontWeight: "bold" }}
                    type="button"
                  >
                    Créer un compte
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

export default Login;
