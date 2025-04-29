import { createSlice } from '@reduxjs/toolkit';

const vendorFromStorage = localStorage.getItem('vendor')
  ? JSON.parse(localStorage.getItem('vendor') as string)
  : null;

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendor: vendorFromStorage,
  },
  reducers: {
    setVendor: (state, action) => {
      state.vendor = action.payload;
      localStorage.setItem('vendor', JSON.stringify(action.payload));
    },
    logoutVendor: (state) => {
      state.vendor = null;
      localStorage.removeItem('vendor'); 
    },
  },
});

export const { setVendor, logoutVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
