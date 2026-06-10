import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDeal: null
};

const dealSlice = createSlice({
  name: 'deal',
  initialState,
  reducers: {
    setSelectedDeal: (state, action) => {
      state.selectedDeal = action.payload;
    },
    clearSelectedDeal: (state) => {
      state.selectedDeal = null;
    }
  }
});

export const { setSelectedDeal, clearSelectedDeal } = dealSlice.actions;
export default dealSlice.reducer;
