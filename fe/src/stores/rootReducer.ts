// // src/stores/rootReducer.ts
// import authReducer from '@domain/auth/authSlice';
// import orderReducer from '@domain/order/order.slice';
// import utilsReducer from '@domain/utils/utils.slice';
import filterAwardsReducer from '@domain/filter/awardFilter.slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  // // auth: authReducer,
  // order: orderReducer,
  // utils: utilsReducer,
  filterAward: filterAwardsReducer,
});

export default rootReducer;
