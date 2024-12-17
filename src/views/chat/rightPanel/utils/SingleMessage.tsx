import { Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import _ from "lodash";
import { useAuthContext } from "../../../../context/AuthContext";

type SingleMessageProps = {
  message: string;
  key: number;
  [key: string]: any;
};

const SingleMessage: React.FC<SingleMessageProps> = ({ messageObject }) => {
  // console.log("<= SingleMessage.tsx ", messageObject);

  if (_.isEmpty(messageObject)) return null;

  const { authUser } = useAuthContext();

  // console.log(authUser);

  const loggedInUser = authUser?.id || "";

  const currentUsersMessage =
    messageObject.sender == loggedInUser ? true : false;
    
  const messageTime = format(messageObject?.createdAt, "HH:mm a");

  return (
    <Flex
      justify={currentUsersMessage ? "flex-end" : "flex-start"}
      align="center"
      wrap="wrap"
      key={messageObject.id}
    >
      <Flex
        gap={2}
        align={"flex-end"}
        bg={currentUsersMessage ? "blue.100" : "gray.100"}
        borderRadius="lg"
        p="2"
        maxWidth="75%"
        width="fit-content"
      >
        <Text>{messageObject.message}</Text>
        <Text fontSize="xs" color="gray.500">
          {messageTime}
        </Text>
      </Flex>
    </Flex>
  );
};

export default SingleMessage;
