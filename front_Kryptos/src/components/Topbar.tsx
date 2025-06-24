import { AppBar, Toolbar, Typography } from "@mui/material";

const Topbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" noWrap>
        Mon Dashboard Crypto
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Topbar;
