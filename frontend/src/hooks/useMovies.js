
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const LIMIT = 12;

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Local state for the input field (immediate)
  const [searchTerm, setSearchTerm] = useState("");
  // State that actually triggers the API call (debounced)
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  // --- DEBOUNCE LOGIC ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(handler); // Cleanup timeout on next keystroke
  }, [searchTerm]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let url = "";
      if (debouncedQuery) {
        url = `/movies/search?q=${debouncedQuery}`;
      } else if (sortBy) {
        url = `/movies/sorted?by=${sortBy}`;
      } else {
        url = `/movies?page=${page}&limit=${LIMIT}`;
      }

      const res = await api.get(url);

      if (res.data.movies) {
        setMovies(res.data.movies);
        setTotal(res.data.total);
      } else {
        setMovies(res.data);
        setTotal(res.data.length);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQuery, sortBy]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Handler to update search
  const handleSearch = (val) => {
    setSearchTerm(val);
    setPage(1);
    if (val) setSortBy(""); // Clear sort if searching
  };

  const handleSort = (val) => {
    setSortBy(val);
    setSearchTerm(""); // Clear search if sorting
    setPage(1);
  };

  return {
    movies, page, setPage, totalPages: Math.ceil(total / LIMIT),
    loading, searchTerm, handleSearch, sortBy, handleSort, refresh: fetchMovies,
  };
};