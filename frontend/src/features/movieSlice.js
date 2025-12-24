import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    list: [],
  },
  reducers: {
    setMovies: (state, action) => {
      state.list = action.payload;
    },
    clearMovies: (state) => {
      state.list = [];
    },
  },
});

export const { setMovies, clearMovies } = movieSlice.actions;
export default movieSlice.reducer;
