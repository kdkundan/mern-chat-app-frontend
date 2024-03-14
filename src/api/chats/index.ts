import API from "..";

export const fetchUserChatsList = async (userID: string) =>
  (await API.get("/chat/" + userID))?.data?.data || [];

  export const fetchSelectedChatsMessages = async (chatID: string) =>
  (await API.get("/message/" + chatID))?.data?.data || [];
