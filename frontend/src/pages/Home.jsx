
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Pagination,
  Chip,
  CardMedia,
  Container,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import { useMovies } from "../hooks/useMovies";

export default function Movies() {
  const {
    movies,
    page,
    setPage,
    totalPages,
    loading,
    searchQuery,
    searchTerm,
    handleSearch,
    sortBy,
    handleSort,
  } = useMovies();

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="800" mb={4} textAlign="center">
          🎬 Movie Gallery
        </Typography>

        {/* --- SEARCH & SORT CONTROLS --- */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            gap: 2, mb: 5, justifyContent: "center", alignItems: "center"
          }}
        >
          <TextField
            placeholder="Search movies..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "white", borderRadius: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              // --- CLEAR BUTTON (X) ---
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch("")} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            sx={{
              width: { xs: "100%", md: "20%" },
              bgcolor: "white",
              borderRadius: 3,
            }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="title">Name (A-Z)</MenuItem>
            <MenuItem value="imdbRating">Top Rated</MenuItem>
            <MenuItem value="year">Release Date</MenuItem>
            <MenuItem value="runtime">Duration</MenuItem>
          </TextField>
        </Box>

        {/* --- MOVIE GRID --- */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                  <Card
                    sx={{
                      width: 345,
                      maxWidth: 345,
                      margin: "auto",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <Box
                      sx={{ position: "relative", width: "100%", pt: "150%" }}
                    >
                      <CardMedia
                        component="img"
                        image={movie.poster}
                        alt={movie.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=";
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontSize: "0.9rem",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ⭐ {movie.imdbRating || "N/A"}
                      </Box>
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        sx={{
                          minHeight: "3.2rem",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {movie.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mb={1}
                        display="block"
                      >
                        {movie.year} • {movie.runtime} min
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minHeight: "2.5rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {movie.description}
                      </Typography>

                      <Box mt="auto" pt={2}>
                        {movie.genre?.slice(0, 2).map((g) => (
                          <Chip
                            key={g}
                            label={g}
                            size="small"
                            sx={{ mr: 0.5, fontSize: "0.7rem",fontWeight:"bold" }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="text.secondary" mt={5}>
                No movies found.
              </Typography>
            )}
          </Grid>
        )}

        {/* --- PAGINATION --- */}
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
    </Box>
  );
}
