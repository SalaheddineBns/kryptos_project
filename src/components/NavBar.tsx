  import React, { useState } from "react";
  import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    Menu,
    MenuItem,
  } from "@mui/material";
  import {
    Menu as MenuIcon,
    AccountCircle,
    Notifications,
    DarkMode,
  } from "@mui/icons-material";
  import { Link, useNavigate } from "react-router-dom";
  import { logout, isAuthenticated } from "../services/authService";

  const NavBar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleLogout = () => {
      logout();
      handleClose();
      navigate("/login");
    };
    return (
      <AppBar
        position="static"
        color="default"
        sx={{ bgcolor: "#121212", color: "white" }}
      >
        <Toolbar disableGutters>
          {/* Logo / Titre collé à gauche */}
          <Typography variant="h6" component="div" sx={{ ml: 2 }}>
            CryptoWatch
          </Typography>

          {/* Espace flexible entre titre et le reste */}
          <Box sx={{ flexGrow: 1 }} />

          {/* If not authenticated, just Home */}
          {!isAuthenticated() ? (
            <Button color="inherit">Home</Button>
          ) : (
            <>
              {/* Navigation links */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/wallets">
                  Wallet
                </Button>
              </Box>

              {/* Right icons */}

              <IconButton color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

              {/* Burger menu for mobile */}
              <IconButton color="inherit" sx={{ display: { md: "none" } }}>
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  };

  export default NavBar;
