import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: null,           // { message, type: 'success'|'error'|'info'|'warning' }
    isNavOpen: false,
    isModalOpen: false,
    modalContent: null,
    globalLoading: false,
  },
  reducers: {
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
    toggleNav(state) {
      state.isNavOpen = !state.isNavOpen;
    },
    closeNav(state) {
      state.isNavOpen = false;
    },
    openModal(state, action) {
      state.isModalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.modalContent = null;
    },
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  showToast, clearToast, toggleNav, closeNav,
  openModal, closeModal, setGlobalLoading,
} = uiSlice.actions;

export const selectToast = (state) => state.ui.toast;
export const selectIsNavOpen = (state) => state.ui.isNavOpen;
export const selectIsModalOpen = (state) => state.ui.isModalOpen;
export const selectModalContent = (state) => state.ui.modalContent;
export const selectGlobalLoading = (state) => state.ui.globalLoading;

export default uiSlice.reducer;
