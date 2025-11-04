"use client";

import { useEffect } from "react";
import ChatLoading from "./ChatLoading";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useUserStore } from "@/src/store/userStore";
import GroupChatModal from "./(models)/GroupChatModal";
import { IUser } from "@/src/services/user.service";
import { useChatStore } from "@/src/store/chatStore";
import { useFetchChats } from "@/src/services/chat.service";
import { getSender } from "@/src/components/logics/chat.logic";
import ProfileImg from "@/src/components/ui/ProfileImg";

const MyChats = () => {
  const { user } = useUserStore();
  const { selectedChat, setSelectedChat, setChats, chats } = useChatStore();
  const { data: fetchchats, isLoading } = useFetchChats(); // fetch chats of logged in user

  useEffect(() => {
    if (fetchchats) {
      setChats(fetchchats);
    }
  }, [fetchchats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "25px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems={{
          base: "flex-start",
          lg: "center",
        }}
        fontWeight="bold"
        flexDirection={{ base: "column", lg: "row" }}
      >
        My Chats
        <GroupChatModal>
          <Button className="btn-teal">New Group Chat</Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {isLoading ? (
          <ChatLoading />
        ) : chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat: any) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
                gap={3}
              >
                <ProfileImg
                  fallback={chat.isGroupChat ? chat.chatName : ""}
                  user={getSender(user as IUser, chat.users) as IUser}
                />
                <div>
                  <Text className="!capitalize">
                    {!chat.isGroupChat
                      ? (getSender(user as IUser, chat.users) as IUser)?.name
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs" className="!line-clamp-1">
                      <b>{chat.latestMessage.sender.name.split(" ")[0]} : </b>
                      {chat.latestMessage.content}
                    </Text>
                  )}
                </div>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No Chats found</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
