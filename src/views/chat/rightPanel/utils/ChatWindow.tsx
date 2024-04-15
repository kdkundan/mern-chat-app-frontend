import { Box, Flex, Text } from "@chakra-ui/react";
import SingleMessage from "./SingleMessage";

function ChatWindow(props) {
  const { messages = [] } = props;
  return (
    <Flex w="100%" h="100%" direction="column" overflowY="auto">
      <Flex w="100%" direction="column" px="4" py="2" gap="4" flexGrow={1}>
        {messages.length === 0 && (
          <Text textAlign="center" color="brand.500">
            No messages yet
          </Text>
        )}
        {messages.length > 0 &&
          messages.map((message, index) => {
            if (message.type === "dateSeparator") {
              // Render Box component for date separators
              return (
                <Box
                  key={index}
                  w="fit-content"
                  margin="0 auto"
                  textAlign="center"
                  bg="secondaryGrey.200" // Make sure to define this color in your theme or replace it with a color from the Chakra UI default theme
                  px={3}
                  py={1}
                  borderRadius={4}
                >
                  <Text fontSize="xs" color="brand.500">
                    {message.date}
                  </Text>{" "}
                  {/* Ensure 'brand.500' and 'secondaryGrey.200' are defined in your theme or replace them */}
                </Box>
              );
            } else {
              // Render SingleMessage for chat messages
              return (
                <SingleMessage
                  key={index}
                  messageObject={message}
                  sender={message.sender}
                  message={message.message}
                />
              );
            }
          })}
      </Flex>
    </Flex>
  );
}

export default ChatWindow;
