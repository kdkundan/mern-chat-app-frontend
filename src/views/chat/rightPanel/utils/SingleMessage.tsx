import { Flex, Text } from '@chakra-ui/react';

type SingleMessageProps = {
  sender: 'sender' | 'receiver';
  message: string;
  key : number;
};

const SingleMessage: React.FC<SingleMessageProps> = ({ sender, message }) => {
  const loggedInUser = localStorage.getItem("chatAppUser");
  const isMessageReceived = sender === loggedInUser ? false : true;
  return (
    <Flex w="100%" justify={isMessageReceived ? 'flex-end' : 'flex-start'}>
      <Text
        bg={isMessageReceived ? 'blue.100' : 'gray.100'}
        p='2'
        borderRadius='lg'
        maxWidth='70%'
      >
        {message}
      </Text>
    </Flex>
  );
};

export default SingleMessage;
