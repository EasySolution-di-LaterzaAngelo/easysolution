import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Prodotto } from '@/types';

const initialState: any = {};

export const setProductsSlice = createSlice({
  name: 'setProducts',
  initialState,
  reducers: {
    updateProducts: (state, action: PayloadAction<Prodotto[]>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProducts } = setProductsSlice.actions;

export const selectProductsValue = (state: RootState) =>
  state.setProducts.value;

export default setProductsSlice.reducer;
