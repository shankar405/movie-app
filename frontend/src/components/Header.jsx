import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

// take first letter of name
const initial =
  typeof user?.name === "string" && user.name.length > 0
    ? user.name[0].toUpperCase()
    : "U";

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate("/login");
  };



  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" fontWeight="bold">
          🎬 MovieDB
        </Typography>

        {/* Profile Section */}
        <Box>
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              cursor: "pointer",
              bgcolor: "primary.main",
              width: 40,
              height: 40,
              fontWeight: "bold",
            }}
          >
            {initial}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: 4,
              },
            }}
          >
            {/* User name */}
            <Box px={2} py={1}>
              <Typography fontWeight="bold">
                {user?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <Divider />

            {/* Logout */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                fontWeight: "bold",
                py: 1.2,
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
