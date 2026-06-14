import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  alertMessage: string | null;
  showModal: boolean;
}

const initialState: UIState = {
  isLoading: false,
  alertMessage: null,
  showModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAlertMessage: (state, action) => {
      state.alertMessage = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    clearAlertMessage: (state) => {
      state.alertMessage = null;
    },
  },
});

export const { setLoading, setAlertMessage, setShowModal, clearAlertMessage } = uiSlice.actions;
export default uiSlice.reducer;
