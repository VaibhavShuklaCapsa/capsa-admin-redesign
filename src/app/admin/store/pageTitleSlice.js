import { createSlice } from '@reduxjs/toolkit'
import { OrganizationName } from '../constants'

const initialState = {
  pageTitle: 'Hello Vendor Name',
  pageSubtitle: ``,
}

const pageTitleSlice = createSlice({
  name: 'pageTitle',
  initialState,
  reducers: {
    changePageTitle(state, action) {
      const { pageTitle, pageSubtitle } = action.payload
      state.pageTitle = pageTitle ?? state.pageTitle
      state.pageSubtitle = pageSubtitle ?? state.pageSubtitle
    },
  },
})

export const { changePageTitle } = pageTitleSlice.actions

export default pageTitleSlice.reducer