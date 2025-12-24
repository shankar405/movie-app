import { TextField, Button, Paper, Typography, Box, Link } from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return "Name is required";

    if (!form.email.trim()) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Enter a valid email address";

    if (!form.password.trim()) return "Password is required";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return "";
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/register", form);

      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          Create Account
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Sign up to continue
        </Typography>

        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            setError("");
          }}
        />

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
          onClick={handleRegister}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <Typography
          variant="body2"
          align="center"
          mt={2}
          color="text.secondary"
        >
          Already have an account?{" "}
          <Link
            component="button"
            underline="none"
            onClick={() => navigate("/login")}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
