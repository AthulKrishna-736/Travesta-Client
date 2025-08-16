import { IUser } from '@/types/user.types';
import { createSlice } from '@reduxjs/toolkit';

const userFromStorage: IUser | null = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: userFromStorage,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;