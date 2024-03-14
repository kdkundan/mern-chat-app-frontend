import _ from "lodash";

interface Chat {
  id: string;
  name: string;
}

interface GetChatNameParams {
  userID?: string;
  chats?: Chat[];
  singleChat?: Chat;
  isSelectedChat?: boolean;
}

export const getChatName = ({
  userID,
  chats,
  singleChat,
  isSelectedChat = false,
}: GetChatNameParams): string => {

  console.log("<= getChatName", userID, chats, singleChat, isSelectedChat);
  
  if (isSelectedChat && !_.isEmpty(singleChat)) return singleChat?.name || "isSelectedChat false";

  if (_.isEmpty(chats) ) return "Empty Chat";


  const chat = chats?.find((chat) => chat.id == userID);

  return chat?.name || "NA";
};
