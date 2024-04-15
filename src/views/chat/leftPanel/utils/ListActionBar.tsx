import { Flex, Text } from "@chakra-ui/react";
import CustomInput from "../../../../component/customInput/CustomInput";

const ListActionBar = () => {
  return (
    <Flex direction="column" p={2}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight={600} fontSize="3xl">Chats</Text>
        <Flex gap={2}>
          <Text fontSize="md">New Chat</Text>
          <Text fontSize="md">More</Text>
        </Flex>
      </Flex>
      <Flex>
        <CustomInput />
      </Flex>
    </Flex>
  );
};

export default ListActionBar;
