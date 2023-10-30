import { createSlice } from '@reduxjs/toolkit';

export interface FilterAwards {
  point: { minPoint: number; maxPoint: number };
  types: string[];
}

const initialState: FilterAwards = {
  point: { maxPoint: 10000, minPoint: 10000 },
  types: [],
};

const filterAwardsSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    saveFilter(state: FilterAwards, action) {
      state.point = action.payload.point;
      state.types = action.payload.types;
    },
  },
});

export const { saveFilter } = filterAwardsSlice.actions;

export const initialOrder = initialState;
export default filterAwardsSlice.reducer;
