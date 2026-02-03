import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import navigationReducer from './slices/navigationSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        navigation: navigationReducer,  
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;