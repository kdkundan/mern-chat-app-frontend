import { Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

// Define the IconProps type
type IconProps = {
  icon: IconType;
  [key: string]: string;
};

// CustomIcon component definition
const CustomIcon: React.FC<IconProps> = ({ icon, ...rest }) => {
  return <Icon as={icon} {...rest} />; // Spread additional props onto the Icon component
};

export default CustomIcon;
