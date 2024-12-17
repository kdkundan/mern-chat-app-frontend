import {
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import CustomInput from "../../../../component/customInput/CustomInput";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiLogOut,
  FiSettings,
  FiBell,
  FiUsers,
  FiMoon,
} from "react-icons/fi";
import { useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";

const ListActionBar = () => {
  const { setAuthUser } = useAuthContext();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const menuHoverBg = useColorModeValue("gray.100", "gray.700");

  const handleLogout = () => {
    setAuthUser(null);
  };

  return (
    <Flex
      direction="column"
      p={4}
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
      position="sticky"
      top={0}
      zIndex={1}
      gap={3}
    >
      {/* Header Section */}
      <Flex alignItems="center" justifyContent="space-between">
        <Text
          fontWeight="bold"
          fontSize="2xl"
          background="linear-gradient(135deg, #3182ce 0%, #319795 100%)"
          backgroundClip="text"
          letterSpacing="tight"
        >
          Chats
        </Text>

        <Flex gap={1}>
          {/* New Chat Menu */}
          <Menu closeOnSelect>
            <MenuButton
              as={IconButton}
              icon={<FiPlus />}
              variant="ghost"
              size="sm"
              color={iconColor}
              _hover={{ bg: menuHoverBg }}
            />
            <MenuList shadow="lg" py={1} borderColor={borderColor} minW="180px">
              <MenuItem
                icon={<FiUsers />}
                _hover={{ bg: menuHoverBg }}
                fontSize="sm"
              >
                New Group Chat
              </MenuItem>
              <MenuItem
                icon={<FiPlus />}
                _hover={{ bg: menuHoverBg }}
                fontSize="sm"
              >
                New Direct Message
              </MenuItem>
            </MenuList>
          </Menu>

          {/* More Options Menu */}
          <Menu closeOnSelect>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
              color={iconColor}
              _hover={{ bg: menuHoverBg }}
            />
            <MenuList shadow="lg" py={1} borderColor={borderColor} minW="180px">
              <MenuItem
                icon={<FiSettings />}
                _hover={{ bg: menuHoverBg }}
                fontSize="sm"
              >
                Settings
              </MenuItem>
              <MenuItem
                icon={<FiBell />}
                _hover={{ bg: menuHoverBg }}
                fontSize="sm"
              >
                Notifications
              </MenuItem>
              <MenuItem
                icon={<FiMoon />}
                _hover={{ bg: menuHoverBg }}
                fontSize="sm"
              >
                Dark Mode
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<FiLogOut />}
                color="red.500"
                _hover={{ bg: "red.50", color: "red.600" }}
                fontSize="sm"
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Search Section */}
      <InputGroup
        size="md"
        transform={isSearchFocused ? "scale(1.01)" : "scale(1)"}
        transition="all 0.2s"
      >
        <InputLeftElement pointerEvents="none">
          <FiSearch color={iconColor} />
        </InputLeftElement>
        <CustomInput
          placeholder="Search conversations..."
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          borderRadius="md"
          _placeholder={{ color: "gray.400", fontSize: "sm" }}
          _hover={{ borderColor: "gray.300" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
        />
      </InputGroup>
    </Flex>
  );
};

export default ListActionBar;
