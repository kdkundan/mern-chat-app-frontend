import { Flex } from "@chakra-ui/react";
import LeftPanel from "./leftPanel/LeftPanel";
import RightPanel from "./rightPanel/RightPanel";
import { useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAuthContext } from "../../context/AuthContext";
import { setAuthToken } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../socket/SocketContext";

export default function Chat() {
  const { setItem } = useLocalStorage();
  const { authUser } = useAuthContext();
  const { socket } = useSocket();
  const navigate = useNavigate();

  // console.log("<= authUser", authUser);

  const loginUserAction = (authUser) => {
    if (!authUser || !authUser?.token) {
      return navigate("/login");
    }
    setAuthToken(authUser?.token || null);
  };

  useEffect(() => {
    loginUserAction(authUser);
  }, [authUser]);

  useEffect(() => {
    if (socket) {
      // Cleanup listeners when component unmounts
      return () => {
        socket.off("message");
      };
    }
  }, [socket]);

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
