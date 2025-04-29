import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import vendorReducer from './slices/vendorSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        vendor: vendorReducer 
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;