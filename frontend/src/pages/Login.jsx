import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Link,
} from "@mui/material";
import  api  from "../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Validation
  const validate = () => {
    if (!form.email.trim()) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email))
      return "Enter a valid email address";

    if (!form.password.trim()) return "Password is required";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return "";
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", form);

      if (res.data.success) {
        // ✅ Save to Redux
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
            role: res.data.user.role,
          })
        );

        // ✅ Persist token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
       if(res.data.user.role==="admin"){
        navigate("/admin");
       }else{   
        navigate("/movies");
       }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f7fa"
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 360,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Welcome Back
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Login to continue
        </Typography>

        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setError("");
          }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            setError("");
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
          }}
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography
          variant="body2"
          align="center"
          mt={2}
          color="text.secondary"
        >
          Don’t have an account?{" "}
          <Link
            component="button"
            underline="none"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
