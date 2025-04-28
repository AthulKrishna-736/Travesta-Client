import { createSlice } from '@reduxjs/toolkit';

const adminFromStorage = localStorage.getItem('admin')
    ? JSON.parse(localStorage.getItem('admin') as string)
    : null;

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        admin: adminFromStorage,
    },
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
            localStorage.setItem('admin', JSON.stringify(action.payload));
        },
        logoutAdmin: (state) => {
            state.admin = null;
            localStorage.removeItem('admin');
        },
    },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
