import { createReducer, combineReducers } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';

const todosReducer = createReducer([], (builder) => {
  builder.addCase('ADD_TODO', (state, action) => {
    state.push(action.payload);
  });
});

const rootReducer = combineReducers({
  todosReducer,
});

export default rootReducer;
