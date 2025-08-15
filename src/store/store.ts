import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import vendorReducer from './slices/vendorSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer,
        vendor: vendorReducer 
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;