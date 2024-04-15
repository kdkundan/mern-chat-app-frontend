import { Flex } from "@chakra-ui/react";
import LeftPanel from "./leftPanel/LeftPanel";
import RightPanel from "./rightPanel/RightPanel";
import { useEffect } from "react";
import { socket } from "../../socket/SocketContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { devUserID } from "../../api";

export default function Chat() {
  const { setItem } = useLocalStorage();

  useEffect(() => {
    socket.connect();
    setItem("chatAppUser", devUserID);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Flex w="100%" h="100%">
      {/* Left Panel - Contacts */}
      <Flex w="24%" h="100%" color="brand.900" bg="gray.100" p={1}>
        <LeftPanel />
      </Flex>
      {/* Right Panel - Chat Section */}
      <Flex flex={1} h="100%" color="brand.900" bg="gray.100" p={1}>
        <RightPanel />
      </Flex>
    </Flex>
  );
}
