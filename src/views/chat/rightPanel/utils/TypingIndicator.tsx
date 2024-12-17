import { Box, Text, keyframes } from "@chakra-ui/react";

const dotAnimation = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

interface TypingIndicatorProps {
  username: string;
}

const TypingIndicator = ({ username }: TypingIndicatorProps) => {
  const dots = [0, 1, 2];

  return (
    <Box px={3} py={2} borderRadius="lg" bg="gray.100" maxW="200px" m={1}>
      <Text fontSize="sm" color="gray.600">
        {username} is typing
        <span style={{ display: "inline-block", width: "24px" }}>
          {dots.map((dot) => (
            <span
              key={dot}
              style={{
                animation: `${dotAnimation} 1s infinite`,
                animationDelay: `${dot * 0.2}s`,
                marginLeft: "2px",
              }}
            >
              .
            </span>
          ))}
        </span>
      </Text>
    </Box>
  );
};

export default TypingIndicator;
