import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface searchState {
  value: string | null;
}

const initialState: searchState = {
  value: localStorage.getItem('inputValue')
    ? localStorage.getItem('inputValue')
    : '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clear: (state) => {
      state.value = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { update, clear } = searchSlice.actions;

export const selectSearchValue = (state: RootState) => state.search.value;

export default searchSlice.reducer;
