"use client";
import { IUser } from "@/src/services/user.service";
import { Box, Text } from "@chakra-ui/react";
import ProfileImg from "@/src/components/ui/ProfileImg";

const UserListItem = ({
  user,
  handleFunction,
}: {
  user: IUser;
  handleFunction: () => void;
}) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      borderRadius="lg"
    >
      <ProfileImg
        style={{ marginRight: "8px", cursor: "pointer" }}
        user={user as IUser}
      />

      <Box>
        <Text>{user?.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
