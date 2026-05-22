import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MOCK_USERS } from "../../../data/mockUsers";
import { LOCAL_STORAGE_KEYS } from "../../../constants/storage";

// create async thunk for login with mock users
export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        const found = MOCK_USERS.find(
            (u) =>
                u.username === credentials.username &&
                u.password === credentials.password
        );

        if (found) {
            // eslint-disable-next-line no-unused-vars
            const { password, ...safeUser } = found;
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, JSON.stringify(safeUser));
            return safeUser;
        }

        return rejectWithValue("Invalid username or password.");
    }
);

const loadUserFromStorage = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const initialState = {
    user: loadUserFromStorage(),
    isAuthenticated: !!loadUserFromStorage(),
    loading: false,
    error: null,
};


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed.";
            });
    },
});

export const { logout } = authSlice.actions;
export const authActions = { ...authSlice.actions, loginThunk };

export const authSelectors = {
    user: (state) => state.auth.user,
    isAuthenticated: (state) => state.auth.isAuthenticated,
    loading: (state) => state.auth.loading,
    error: (state) => state.auth.error,
};

export default authSlice.reducer;
