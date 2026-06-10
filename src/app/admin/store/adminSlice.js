import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedUser: null,
  filters: {},
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },

    setFilters: (state, action) => {
      state.filters = action.payload
    },

    clearAdmin: (state) => {
      state.selectedUser = null
      state.filters = {}
    },
  },
})

export const {
  setSelectedUser,
  setFilters,
  clearAdmin,
} = adminSlice.actions

export default adminSlice.reducer