import {
  Avatar,
  Flex,
  Text,
  Box,
  Badge,
  SlideFade,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { trimText } from "../../../../utils/textTrim";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { setSelectedChat } from "../../../../redux/slices/chats";
import { getChatName } from "../../../../utils/chatFunctions";
import { useAuthContext } from "../../../../context/AuthContext";

const ChatsList = () => {
  const { userChats, selectedChat } = useSelector((state) => state.chat);
  const { getItem } = useLocalStorage();
  const dispatch = useDispatch();
  const { authUser } = useAuthContext();

  // Theme colors
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const selectedBg = useColorModeValue("blue.500", "blue.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const timeColor = useColorModeValue("gray.500", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  const formatTime = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "HH:mm");
    } else if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, "dd MMM");
    }
    return format(messageDate, "dd/MM/yy");
  };

  const handleSelectChat = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      overflowY="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.300",
          borderRadius: "2px",
        },
      }}
    >
      {userChats?.length > 0 ? (
        userChats.map((chat, index) => {
          if (!chat) return null;

          const name = chat?.isGroupChat
            ? trimText(chat?.name)
            : getChatName({
                userID: authUser?.id,
                chats: chat?.members,
              });
          console.log("<= name", name, {
            userID: authUser?.id,
            chats: chat?.members,
          });
          const lastMessage = trimText(
            chat?.lastMessage || "No messages yet",
            40
          );
          const lastMessageTime = formatTime(chat?.updatedAt);
          const isSelected = selectedChat?.id === chat?.id;

          return (
            <SlideFade
              in={true}
              offsetY={20}
              delay={index * 0.1}
              key={chat?.id}
            >
              <Flex
                p={3}
                mb={1}
                cursor="pointer"
                borderRadius="md"
                bg={isSelected ? selectedBg : cardBg}
                color={isSelected ? "white" : textColor}
                _hover={{
                  bg: isSelected ? selectedBg : hoverBg,
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
                position="relative"
                onClick={() => handleSelectChat(chat)}
              >
                <Avatar
                  name={name}
                  src={chat?.profilePicture}
                  size="md"
                  boxShadow="sm"
                />

                <Flex flex={1} direction="column" pl={3} overflow="hidden">
                  <Flex align="center" justify="space-between" w="100%">
                    <Text fontWeight="600" fontSize="md" noOfLines={1}>
                      {name}
                      {chat?.isGroupChat && (
                        <Badge
                          ml={2}
                          colorScheme={isSelected ? "whiteAlpha" : "blue"}
                          fontSize="xs"
                        >
                          Group
                        </Badge>
                      )}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={isSelected ? "whiteAlpha.800" : timeColor}
                      whiteSpace="nowrap"
                      ml={2}
                    >
                      {lastMessageTime}
                    </Text>
                  </Flex>

                  <Flex align="center" mt={1}>
                    <Text
                      fontSize="sm"
                      color={isSelected ? "whiteAlpha.800" : subTextColor}
                      noOfLines={1}
                      flex={1}
                    >
                      {lastMessage}
                    </Text>
                    {chat?.unreadCount > 0 && (
                      <Badge
                        colorScheme={isSelected ? "whiteAlpha" : "blue"}
                        borderRadius="full"
                        ml={2}
                        minW="20px"
                        textAlign="center"
                      >
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
              </Flex>

              {index < userChats.length - 1 && (
                <Box w="100%" h="1px" bg={dividerColor} opacity={0.5} />
              )}
            </SlideFade>
          );
        })
      ) : (
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          p={6}
          color={subTextColor}
        >
          <Text fontSize="lg" mb={2}>
            No conversations yet
          </Text>
          <Text fontSize="sm" textAlign="center">
            Start a new chat by searching for users
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ChatsList;
