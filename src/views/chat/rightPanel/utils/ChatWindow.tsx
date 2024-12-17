import { Box, Flex, Text, Button, Fade, SlideFade } from "@chakra-ui/react";
import SingleMessage from "./SingleMessage";
import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "@chakra-ui/icons";

function ChatWindow(props) {
  const { messages = [] } = props;
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to handle smooth scroll to bottom
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Function to check if scroll is near bottom
  const isScrolledNearBottom = () => {
    if (!containerRef.current) return false;
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const scrollThreshold = 100;
    return scrollHeight - scrollTop - clientHeight < scrollThreshold;
  };

  // Handle scroll events
  const handleScroll = () => {
    const isNearBottom = isScrolledNearBottom();
    setShowScrollButton(!isNearBottom);
    if (isNearBottom) {
      setUnreadCount(0);
    }
  };

  // Effect for initial scroll
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  // Effect for handling new messages
  useEffect(() => {
    if (isScrolledNearBottom()) {
      scrollToBottom();
    } else {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages.length]);

  interface Message {
    type?: string;
    createdAt: string | Date;
    // Add other message properties you need
  }

  const groupMessagesByDate = (msgs: Message[] | null | undefined) => {
    // Handle null or undefined messages array
    if (!msgs || !Array.isArray(msgs)) {
      return {};
    }

    const groups: { [key: string]: Message[] } = {};

    msgs.forEach((msg) => {
      // Check if message exists and has createdAt
      if (msg && msg.createdAt && !msg?.type) {
        try {
          const date = new Date(msg.createdAt).toLocaleDateString();
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(msg);
        } catch (error) {
          console.error("Error processing message:", error, msg);
          // Continue with next message instead of crashing
        }
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(
    [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  return (
    <Flex position="relative" w="100%" h="100%" direction="column" bg="gray.50">
      <Flex
        ref={containerRef}
        w="100%"
        h="100%"
        direction="column"
        overflowY="auto"
        onScroll={handleScroll}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.300",
            borderRadius: "3px",
            "&:hover": {
              background: "gray.400",
            },
          },
        }}
      >
        <Flex
          w="100%"
          direction="column"
          px="4"
          py="2"
          gap="4"
          flexGrow={1}
          justify="flex-end"
        >
          {messages.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              flex={1}
              opacity={0.7}
            >
              <Text textAlign="center" color="brand.500" fontSize="lg">
                No messages yet
              </Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Start the conversation by sending a message
              </Text>
            </Flex>
          ) : (
            Object.entries(messageGroups).map(([date, groupMessages]) => (
              <Box key={date}>
                <Box
                  w="fit-content"
                  margin="0 auto"
                  textAlign="center"
                  bg="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  mb={4}
                  boxShadow="sm"
                >
                  <Text fontSize="xs" color="gray.500">
                    {date}
                  </Text>
                </Box>
                <Flex direction="column" gap={2}>
                  {groupMessages.map((message, index) => (
                    <SlideFade
                      key={message._id || index}
                      in={true}
                      offsetY="20px"
                    >
                      <SingleMessage
                        messageObject={message}
                        sender={message?.sender}
                        message={message?.message}
                        isLastInGroup={index === groupMessages.length - 1}
                      />
                    </SlideFade>
                  ))}
                </Flex>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Flex>
      </Flex>

      {/* Scroll to bottom button with unread count */}
      <Fade in={showScrollButton}>
        <Button
          position="absolute"
          bottom="4"
          right="4"
          size="sm"
          colorScheme="blue"
          borderRadius="full"
          boxShadow="md"
          onClick={() => scrollToBottom()}
          leftIcon={<ArrowDownIcon />}
          _hover={{
            transform: "translateY(-2px)",
          }}
          transition="all 0.2s"
        >
          {unreadCount > 0 ? `${unreadCount} new` : "Latest"}
        </Button>
      </Fade>
    </Flex>
  );
}

export default ChatWindow;
