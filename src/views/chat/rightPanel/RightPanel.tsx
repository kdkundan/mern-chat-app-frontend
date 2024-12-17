import {
  Avatar,
  Flex,
  IconButton,
  Text,
  Skeleton,
  useColorModeValue,
  SlideFade,
} from "@chakra-ui/react";
import CustomInput from "../../../component/customInput/CustomInput";
import CustomIcon from "../../../component/iconWrapper/CustomIcons";
import { FaEllipsisVertical } from "react-icons/fa6";
import ChatWindow from "./utils/ChatWindow";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSelectedChatsMessages } from "../../../api/chats";
import { getChatName } from "../../../utils/chatFunctions";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { IoSend } from "react-icons/io5";
import { useEffect, useState, useCallback, useRef } from "react";
import { sendMessage } from "../../../api/message/text";
import { useAuthContext } from "../../../context/AuthContext";
import { useSocket } from "../../../socket/SocketContext";

// Types for better type safety
interface Message {
  _id?: string;
  message: string;
  chat: string;
  sender: string;
  createdAt?: string;
  temporaryId?: string;
}

function RightPanel() {
  const { selectedChat } = useSelector((state) => state?.chat);
  const { getItem, setItem } = useLocalStorage();
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const { authUser } = useAuthContext();
  const loggedInUser = authUser;

  const [typedMessage, setTypedMessage] = useState("");
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const messageCache = useRef(new Map<string, Message[]>());

  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Function to get cached messages
  const getCachedMessages = useCallback((chatId: string) => {
    const localMessages = localStorage.getItem(`chat_messages_${chatId}`);
    if (localMessages) {
      return JSON.parse(localMessages);
    }
    return null;
  }, []);

  // Function to update cache
  const updateMessageCache = useCallback(
    (chatId: string, messages: Message[]) => {
      messageCache.current.set(chatId, messages);
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(messages));
    },
    []
  );

  // Optimized query with cache
  const { data: selectedChatsMessages, isLoading } = useQuery({
    queryKey: ["selectedChatMessages", selectedChat?.id],
    queryFn: async () => {
      // Check cache first
      const cachedMessages = getCachedMessages(selectedChat?.id);
      if (cachedMessages) {
        return cachedMessages;
      }
      const messages = await fetchSelectedChatsMessages(selectedChat?.id);
      updateMessageCache(selectedChat?.id, messages);
      return messages;
    },
    enabled: !!selectedChat?.id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Socket connection management
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleNewMessage = (message: Message) => {
      console.log("Received new message:", message);
      if (message.chat === selectedChat.id) {
        queryClient.setQueryData(
          ["selectedChatMessages", selectedChat.id],
          (old: Message[] = []) => {
            // Check if this message is already in our list (either by _id or temporaryId)
            const messageExists = old.some(
              (msg) =>
                (msg._id && msg._id === message._id) ||
                (msg.temporaryId && msg.sender === loggedInUser?.id)
            );

            // If message exists, don't add it again
            if (messageExists) {
              return old;
            }

            const newMessages = [...old, message];
            updateMessageCache(selectedChat.id, newMessages);
            return newMessages;
          }
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.emit("joinChat", selectedChat.id);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChat?.id, updateMessageCache, loggedInUser?.id]);

  // Optimistic updates and message sending
  const handleMessageSend = async () => {
    if (typedMessage?.trim().length < 1 || !isConnected || !selectedChat?.id) {
      return;
    }

    const temporaryId = Date.now().toString();
    const newMessage: Message = {
      temporaryId,
      message: typedMessage,
      chat: selectedChat.id,
      sender: loggedInUser?.id,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    queryClient.setQueryData(
      ["selectedChatMessages", selectedChat.id],
      (old: Message[] = []) => {
        const newMessages = [...old, newMessage];
        updateMessageCache(selectedChat.id, newMessages);
        return newMessages;
      }
    );

    setPendingMessages((prev) => [...prev, newMessage]);
    setTypedMessage("");

    try {
      const response = await sendMessage({
        message: typedMessage,
        chatID: selectedChat.id,
        senderID: loggedInUser?.id,
      });

      if (response && socket) {
        socket.emit("sendMessage", {
          ...response,
          chat: selectedChat.id,
        });

        // Update cache by replacing the temporary message with the confirmed one
        queryClient.setQueryData(
          ["selectedChatMessages", selectedChat.id],
          (old: Message[] = []) => {
            const messages = old.map((msg) =>
              msg.temporaryId === temporaryId ? response : msg
            );
            updateMessageCache(selectedChat.id, messages);
            return messages;
          }
        );

        setPendingMessages((prev) =>
          prev.filter((msg) => msg.temporaryId !== temporaryId)
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Mark message as failed in UI
      queryClient.setQueryData(
        ["selectedChatMessages", selectedChat.id],
        (old: Message[] = []) => {
          const messages = old.map((msg) =>
            msg.temporaryId === temporaryId ? { ...msg, failed: true } : msg
          );
          updateMessageCache(selectedChat.id, messages);
          return messages;
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const chatName = getChatName({
    userID: loggedInUser?.id,
    chats: selectedChat?.members,
  });

  return (
    <Flex
      direction="column"
      w="100%"
      h="100%"
      bg={bgColor}
      borderLeft="1px"
      borderColor={borderColor}
    >
      {!selectedChat ? (
        <SlideFade in={true} offsetY={20}>
          <Flex
            flex={1}
            w="100%"
            h="100%"
            justify="center"
            align="center"
            direction="column"
            gap={4}
            p={8}
          >
            <Text fontSize="xl" color="gray.500">
              👋 Select a chat to start messaging
            </Text>
            <Text fontSize="sm" color="gray.400">
              Choose from your conversations on the left
            </Text>
          </Flex>
        </SlideFade>
      ) : (
        <>
          <Flex
            h="10dvh"
            justify="space-between"
            align="center"
            p={4}
            bg={headerBg}
            borderBottom="1px"
            borderColor={borderColor}
            transition="all 0.2s"
          >
            <Flex h="100%" flex={1} gap={4} align="center">
              {isLoading ? (
                <Skeleton
                  startColor="gray.100"
                  endColor="gray.300"
                  height="40px"
                  width="40px"
                  borderRadius="full"
                />
              ) : (
                <Avatar
                  size="md"
                  boxShadow="sm"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                />
              )}
              <Flex direction="column">
                {isLoading ? (
                  <>
                    <Skeleton height="24px" width="150px" mb={2} />
                    <Skeleton height="16px" width="100px" />
                  </>
                ) : (
                  <>
                    <Text
                      fontSize="xl"
                      fontWeight="600"
                      _hover={{ color: "blue.500" }}
                      transition="color 0.2s"
                    >
                      {chatName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {isConnected ? "Online" : "Offline"}
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
            <IconButton
              aria-label="Chat options"
              icon={<CustomIcon icon={FaEllipsisVertical} />}
              variant="ghost"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            />
          </Flex>

          <Flex w="100%" h="80dvh" flex={1}>
            <ChatWindow
              messages={selectedChatsMessages}
              pendingMessages={pendingMessages}
            />
          </Flex>

          <Flex
            h="10dvh"
            align="center"
            gap={3}
            p={4}
            borderTop="1px"
            borderColor={borderColor}
            bg={headerBg}
          >
            <CustomInput
              value={typedMessage}
              setValue={setTypedMessage}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              size="lg"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px blue.400",
              }}
            />
            <IconButton
              aria-label="send message"
              onClick={handleMessageSend}
              isDisabled={!typedMessage.trim() || !isConnected}
              colorScheme="blue"
              size="lg"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "md",
              }}
            >
              <CustomIcon icon={IoSend} />
            </IconButton>
          </Flex>
        </>
      )}
    </Flex>
  );
}

export default RightPanel;
