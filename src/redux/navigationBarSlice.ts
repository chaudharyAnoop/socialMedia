import { createSlice } from "@reduxjs/toolkit";

interface NavigationBarState {
  isVisible: boolean;
}

const initialState: NavigationBarState = {
  isVisible: false,
};

const navigationbarSlice = createSlice({
  name: "navigationbar",
  initialState,
  reducers: {
    toggleNavigationBar: (state) => {
      state.isVisible = !state.isVisible;
    },
    showNavigationBar: (state) => {
      state.isVisible = true;
    },
    hideNavigationBar: (state) => {
      state.isVisible = false;
    },
  },
});

export const { toggleNavigationBar, showNavigationBar, hideNavigationBar } =
  navigationbarSlice.actions;
export default navigationbarSlice.reducer;
