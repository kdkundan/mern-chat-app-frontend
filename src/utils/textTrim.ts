export const trimText = (text: string, length: number = 16) => {
  const textLength = text?.length || 0;
  return textLength > 0
    ? textLength > length
      ? text?.substring(0, length) + "..."
      : text
    : "NA";
};
