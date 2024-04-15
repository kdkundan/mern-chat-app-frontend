import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userChats: [],
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chatData",
  initialState: initialState,
  reducers: {
    setUserChats: (state, action) => {
      state.userChats = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setUserChats, setSelectedChat } = chatSlice.actions;

export default chatSlice.reducer;
