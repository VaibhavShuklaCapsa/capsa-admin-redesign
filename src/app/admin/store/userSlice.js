import { createSlice } from '@reduxjs/toolkit'
import { getProfileFromToken } from '../services/auth'


const {role} = getProfileFromToken()

const initialState = {
  userType: "",
  userAction: ``,
  userName: "Vendor Name",
  invoice: {},
  transaction: {},
  submitApiResponse: null,  // Store complete Submit API response
  bulkUploadFile: null,  // Store the uploaded CSV file for multi-upload
  subAdminType: ""  // Store sub-admin type: 'Reviewer' | 'Uploader' | 'Approver'
}

const sanitizeInvoicePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;

  const sanitized = { ...payload };

  if (sanitized.file instanceof File) {
    sanitized.file = {
      name: sanitized.file.name,
      size: sanitized.file.size,
      type: sanitized.file.type,
      lastModified: sanitized.file.lastModified,
      lastModifiedDate: sanitized.file.lastModifiedDate?.toISOString?.() ?? null,
    };
  }

  return sanitized;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserAction(state, action) {
      const { userAction } = action.payload
      state.userAction = userAction ?? state.pageTitle
    },
    changeUserType(state, action) {
      const {userType} = action.payload
      state.userType = userType ?? state.userType
    },
    changeSubAdminType(state, action) {
      const {subAdminType} = action.payload
      state.subAdminType = subAdminType ?? state.subAdminType
    },
    updateInvoice(state, action) {
      const {value} = action.payload
      state.invoice = {...state.invoice, ...sanitizeInvoicePayload(value)}
    },
    addInvoice(state, action) {
      state.invoice = sanitizeInvoicePayload(action.payload)
    },
    addTransaction(state, action) {
      state.transaction = action.payload
    },
    setSubmitApiResponse(state, action) {
      // Store the complete Submit API response
      state.submitApiResponse = action.payload;
    },
    setBulkUploadFile(state, action) {
      // Store file metadata (not the File object itself to maintain serializability)
      if (action.payload) {
        state.bulkUploadFile = {
          name: action.payload.name,
          size: action.payload.size,
          type: action.payload.type,
          lastModified: action.payload.lastModified
        };
      } else {
        state.bulkUploadFile = null;
      }
    },
  }, 
})

export const { changeUserAction, changeUserType, changeSubAdminType, updateInvoice, addInvoice, addTransaction, setSubmitApiResponse, setBulkUploadFile } = userSlice.actions

export default userSlice.reducer