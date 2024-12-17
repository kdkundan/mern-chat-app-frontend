import { Input } from "@chakra-ui/react";

type Props = {
  value: string;
  setValue: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Add this line
};

const CustomInput = (props: Props) => {
  const { value, setValue, onKeyDown } = props; // Add onKeyDown to destructuring

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Input
      placeholder="type here"
      variant="contain"
      value={value}
      onChange={handleValueChange}
      onKeyDown={onKeyDown} // Add this line
    />
  );
};

export default CustomInput;
