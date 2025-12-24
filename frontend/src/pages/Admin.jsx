import React, { useState } from "react";
import api from "../services/api";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Delete,
  Edit,
  Add,
  Close,
  Movie,
  CalendarToday,
  Star,
  Image,
  Description,
  Label,
} from "@mui/icons-material";
import Header from "../components/Header";
import { useMovies } from "../hooks/useMovies";

const Admin = () => {
  const {
    movies,
    page,
    setPage,
    totalPages,
    loading,
    searchQuery,
    handleSearch,
    sortBy,
    handleSort,
    refresh,
  } = useMovies();

  // --- Modal & Form State ---
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    runtime: "",
    imdbRating: "",
    poster: "",
    description: "",
    genre: "",
  });

  // --- Handlers ---
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for that specific field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleOpen = (movie = null) => {
    if (movie) {
      setEditMode(true);
      setSelectedId(movie._id);
      setFormData({
        title: movie.title,
        year: movie.year,
        runtime: movie.runtime,
        imdbRating: movie.imdbRating,
        poster: movie.poster,
        description: movie.description,
        genre: movie.genre?.join(", ") || "",
      });
    } else {
      setEditMode(false);
      setFormData({
        title: "",
        year: "",
        runtime: "",
        imdbRating: "",
        poster: "",
        description: "",
        genre: "",
      });
    }
    setOpen(true);
  };

  // --- Validation Logic ---
  const validate = () => {
    let tempErrors = {};
    tempErrors.title = formData.title ? "" : "Title is required";
    tempErrors.year = formData.year ? "" : "Release year is required";
    tempErrors.imdbRating = formData.imdbRating ? "" : "Rating is required";
    tempErrors.poster = formData.poster ? "" : "Poster URL is required";
    tempErrors.description = formData.description
      ? ""
      : "Description is required";
    tempErrors.genre = formData.genre ? "" : "At least one genre is required";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  // --- API Actions ---
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      // Format genre back to array for backend
      const payload = {
        ...formData,
        genre:
          typeof formData.genre === "string"
            ? formData.genre.split(",").map((g) => g.trim())
            : formData.genre,
      };

      if (editMode) {
        await api.put(`/movies/${selectedId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/movies`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsSubmitting(false);
      refresh();
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving movie details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await api.delete(`/movies/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        refresh();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Top Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          mb={3}
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold">
            Admin Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Movie
          </Button>
        </Box>

        {/* Search & Sort Row */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            display: "flex",
            gap: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="imdbRating">Rating</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </TextField>
        </Paper>

        {/* Table View */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 2 }}
        >
          {loading ? (
            <Box p={10} textAlign="center">
              <CircularProgress />
            </Box>
          ) : movies.length > 0 ? (
            <Table>
              <TableHead sx={{ bgcolor: "#eee" }}>
                <TableRow>
                  <TableCell>
                    <strong>Poster</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Year</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Rating</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies.map((m) => (
                  <TableRow key={m._id} hover>
                    <TableCell>
                      <img
                        src={m.poster}
                        width="45"
                        style={{
                          borderRadius: 4,
                          height: "60px",
                          objectFit: "cover",
                        }}
                        alt={m.title}
                        onError={(e) => {
                          e.target.src =
                            "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <strong>{m.title}</strong>
                    </TableCell>
                    <TableCell>{m.year}</TableCell>
                    <TableCell>⭐ {m.imdbRating}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpen(m)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(m._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 10,
                textAlign: "center",
              }}
              mt={5}
            >
              No movies found.
            </Typography>
          )}
        </TableContainer>


          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>

      </Container>

      {/* --- Add/Edit Dialog --- */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md" // Makes the dialog significantly wider
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1, // Inner padding for the dialog paper
              boxShadow: "0px 20px 50px rgba(0,0,0,0.1)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.4rem",
            borderBottom: "1px solid #eee",
          }}
        >
          {editMode ? "📝 Edit Movie Details" : "🎬 Add New Movie"}
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 4, px: 4, height: "50vh", overflowy: "auto" }}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Movie Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Movie color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Release Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              error={!!errors.year}
              helperText={errors.year}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="IMDb Rating"
              name="imdbRating"
              value={formData.imdbRating}
              onChange={handleChange}
              error={!!errors.imdbRating}
              helperText={errors.imdbRating}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Star sx={{ color: "#ffc107" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Poster Image URL"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              error={!!errors.poster}
              helperText={errors.poster}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Movie Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />

            <TextField
              fullWidth
              label="Genres (comma separated)"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              error={!!errors.genre}
              helperText={errors.genre || "e.g. Action, Drama, Sci-Fi"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Label color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{ px: 4, py: 2, gap: 2, borderTop: "1px solid #eee" }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2, px: 4, minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ borderRadius: 2, px: 6, fontWeight: "bold", minWidth: 160 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : editMode ? (
              "Update Movie"
            ) : (
              "Save Movie"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
