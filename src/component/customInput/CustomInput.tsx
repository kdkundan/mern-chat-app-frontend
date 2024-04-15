import { Input } from "@chakra-ui/react";

type Props = {
  value: string;
  setValue: (value: string) => void;
};

const CustomInput = (props: Props) => {
  const { value, setValue } = props;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Input
      placeholder="type here"
      variant="contain"
      value={value}
      onChange={handleValueChange}
    />
  );
};

export default CustomInput;
