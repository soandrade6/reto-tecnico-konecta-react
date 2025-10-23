import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosClient";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, captchaToken }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password, captchaToken });
      const { token } = res.data;

      // decodificar token JWT (base64)
      const decoded = JSON.parse(atob(token.split(".")[1]));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(decoded));

      return decoded;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  }
);


export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.clear();
  return null;
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
