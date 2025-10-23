import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { text: "Ventas", path: "sales" },
    { text: "Estadísticas", path: "stats" },
    ...(user?.role === 1 ? [{ text: "Usuarios", path: "users" }] : []),
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <AppBar position="static" sx={{ bgcolor: "primary.main", minHeight: 80 }}>
        <Toolbar sx={{ minHeight: 80, px: 3, py:3 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 3, fontSize: 30 }}
          >
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>

          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Panel de {user?.role === 1 ? "Administrador" : "Asesor"}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 3,
              py: 1.5,
              px: 3,
              boxShadow: 3,
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "primary",
                boxShadow: 5,
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List sx={{ width: 240 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={toggleDrawer}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3, bgcolor: "background.default" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
