import { Avatar, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { trimText } from "../../../../utils/textTrim";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { setSelectedChat } from "../../../../redux/slices/chats";
import { getChatName } from "../../../../utils/chatFunctions";

const ChatsList = () => {
  const { userChats, selectedChat } = useSelector((state) => state.chat);
  const { getItem } = useLocalStorage();

  const dispatch = useDispatch();

  const handleSelectChat = (chat: Record<string, any>) => {
    dispatch(setSelectedChat(chat));
  };

  // console.log("<= userChats", userChats);
  return (
    <Flex w="100%" h="100%" direction="column">
      {userChats?.length > 0 &&
        userChats.map((chat: Record<string, any>) => {
          if (!chat) return null;

          const name = chat?.isGroupChat
            ? trimText(chat?.name)
            : getChatName({userID : getItem("chatAppUser"), chats : chat?.members});
          const lastMessage = trimText(chat?.lastMessage);
          const lastMessageTime = format(chat?.updatedAt, "dd-mm-yy");
          return (
            <Flex
              key={chat?.id}
              p={2}
              my={1}
              _hover={{ bg: "brand.100" }}
              cursor="pointer"
              borderRadius={4}
              onClick={() => handleSelectChat(chat)}
              bg={selectedChat === chat ? "#38B2AC" : "#fff"}
              color={selectedChat === chat ? "white" : "black"}
            >
              <Avatar name={name} src={chat?.profilePicture} />
              <Flex flex={1} direction="column" pl={2}>
                <Text>{name}</Text>
                <p>{lastMessage}</p>
              </Flex>
              <Flex
                direction="column"
                h="100%"
                alignItems="center"
                justify="center"
              >
                <p>{lastMessageTime}</p>
              </Flex>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default ChatsList;
