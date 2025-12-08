import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
    lastVisitedPath: string | null;
}

const initialState: NavigationState = {
    lastVisitedPath: sessionStorage.getItem("lastVisitedPath") || null,
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        saveLastVisitedPath: (state, action: PayloadAction<string>) => {
            state.lastVisitedPath = action.payload;
            sessionStorage.setItem("lastVisitedPath", action.payload);
        },
        clearLastVisitedPath: (state) => {
            state.lastVisitedPath = null;
            sessionStorage.removeItem("lastVisitedPath");
        }
    }
});

export const { saveLastVisitedPath, clearLastVisitedPath } = navigationSlice.actions;
export default navigationSlice.reducer;
