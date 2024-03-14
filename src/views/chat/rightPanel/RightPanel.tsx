import { Flex, Text } from "@chakra-ui/react";
import CustomInput from "../../../component/customInput/CustomInput";
import CustomIcon from "../../../component/iconWrapper/CustomIcons";
import { FaEllipsisVertical } from "react-icons/fa6";
import ChatWindow from "./utils/ChatWindow";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchSelectedChatsMessages } from "../../../api/chats";
import { getChatName } from "../../../utils/chatFunctions";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

function RightPanel() {
  const { selectedChat } = useSelector((state) => state.chat);

  const { getItem } = useLocalStorage();

  const { data: selectedChatMessages, isLoading } = useQuery({
    queryKey: ["selectedChatMessages", selectedChat?.id],
    queryFn: () => fetchSelectedChatsMessages(selectedChat?.id),
  });

  const chatName = getChatName({userID : getItem("chatAppUser"), chats : selectedChat?.members});

  // console.log("<= ",selectedChatMessages);

  return (
    <Flex direction="column" w="100%" h="100%" bg="secondaryGrey.100">
      {!selectedChat ? (
        <Flex flex={1} w="100%" h="100%" justify="center" align="center">
          <Text>Select Chat for reading message</Text>
        </Flex>
      ) : (
        <>
          <Flex h="10dvh" justify="space-between" align="center" p={2}>
            <Flex h="100%" flex={1} direction="column">
              <Text fontSize="xl">{chatName}</Text>
              <Text fontSize="sm">Chat Name</Text>
            </Flex>
            <CustomIcon icon={FaEllipsisVertical} cursor="pointer" />
          </Flex>
          <Flex w="100%" h="80dvh" flex={1} bg="gray">
            {isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <ChatWindow messages={selectedChatMessages} />
            )}
          </Flex>
          <Flex h="10dvh" align="center">
            <CustomInput />
          </Flex>
        </>
      )}
    </Flex>
  );
}

export default RightPanel;
