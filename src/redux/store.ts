import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import chats from "./slices/chats";


const reducer = combineReducers({
  user: userReducer,
  chat : chats
});

const store = configureStore({
  reducer,
});

export default store;
