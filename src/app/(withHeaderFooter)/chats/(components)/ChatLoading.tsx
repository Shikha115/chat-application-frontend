import { Skeleton, Stack } from "@chakra-ui/react";


const ChatLoading = () => {
  return (
    <Stack>
        {Array(9).fill(0).map((_, index) => (
          <Skeleton key={index} height="45px" />
        ))}
    </Stack>
  );
};

export default ChatLoading;
