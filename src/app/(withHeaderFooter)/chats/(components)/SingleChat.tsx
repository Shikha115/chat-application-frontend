"use client";

import { Suspense, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import Lottie from "react-lottie";
import io, { Socket } from "socket.io-client";
import { toaster } from "@/src/components/ui/toaster";
import {
  Box,
  Field,
  Fieldset,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import ProfileModal from "./(models)/ProfileModal";
import { IUser } from "@/src/services/user.service";
import UpdateGroupChatModal from "./(models)/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "@/src/animations/typing.json";
import { useChatStore } from "@/src/store/chatStore";
import { getSender } from "@/src/components/logics/chat.logic";
import { useUserStore } from "@/src/store/userStore";
import {
  IMessage,
  useFetchMessages,
  useSendMessages,
} from "@/src/services/message.service";
import { Base_Url } from "@/src/services/url.service";
const ENDPOINT = Base_Url;
let socket: Socket;

const SingleChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { selectedChat } = useChatStore();
  const { user, setNotifications, notifications } = useUserStore();
  const { mutateAsync: sendMessage } = useSendMessages();
  const {
    data: messages,
    isLoading: loading,
    refetch: refetchMessage,
  } = useFetchMessages(selectedChat?._id as string);

  // console.log(messages, "messages", selectedChat?._id);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSendMessage = async (event: any) => {
    if (event.key === "Enter") {
      if (newMessage === "") {
        toaster.create({
          title: "Error Occured!",
          description: "Message cannot be empty",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
      socket.emit("stop typing", selectedChat?._id);
      try {
        const { data } = await sendMessage({
          content: newMessage,
          chat: selectedChat?._id as string,
        });
        // console.log("Message sent:", data);
        setNewMessage("");
        socket.emit("new message", data.data);
      } catch (error) {
        console.log("Error sending message:", error);
        toaster.create({
          title: "Error Occured!",
          description: "Failed to send the Message",
          type: "error",
          duration: 5000,
          closable: true,
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT); // connection setup
    socket.emit("setup", user); // send logged in user
    socket.on("connected", () => setSocketConnected(true)); // as soon as receive connected from server
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (messages) {
      socket.emit("join chat", selectedChat?._id);
    }
  }, [messages]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChat || // if chat is not selected
        selectedChat._id !== newMessageRecieved.chat._id // new msg doesn't belong to current chat
      ) {
        if (!notifications.find((n) => n._id === newMessageRecieved._id)) {
          setNotifications([newMessageRecieved, ...notifications]);
          // console.log("New message notification:", newMessageRecieved);
        }
      } else {
        console.log("Refetching messages");
        refetchMessage();
      }
    });
  });

  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      // console.log("emit typing");
      socket.emit("typing", selectedChat?._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id); // stop typing after 3 seconds
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between flex-1 w-full">
            {messages &&
              (!selectedChat?.isGroupChat ? (
                <>
                  <Text fontSize={{ base: "28px", md: "30px" }}>
                    {(
                      getSender(
                        user as IUser,
                        selectedChat.users as IUser[]
                      ) as IUser
                    )?.name?.toUpperCase()}
                  </Text>
                  <div>
                    <IconButton
                      display={{ base: "flex" }}
                      onClick={() => setShowProfileModal(true)}
                      className="btn-teal"
                      style={{
                        height: "35px",
                        minWidth: "35px",
                      }}
                    >
                      <FaEye className="!w-[16px]" />
                    </IconButton>
                    <ProfileModal
                      isOpen={showProfileModal}
                      setIsOpen={() => setShowProfileModal(false)}
                      user={
                        getSender(
                          user as IUser,
                          selectedChat.users as IUser[]
                        ) as IUser
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <Text fontSize={{ base: "28px", md: "30px" }}>
                    {selectedChat?.chatName?.toUpperCase()}
                  </Text>
                  <UpdateGroupChatModal />
                </>
              ))}
          </div>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            backgroundImage={`url("/images/main-bg.png")`}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
              // <Box
              //   display="flex"
              //   alignItems="center"
              //   justifyContent="center"
              //   h="100%"
              // >
              //   <Text fontSize="3xl" pb={3}>
              //     Start your first conversation
              //   </Text>
              // </Box>
            ) : (
              <div className="messages !mb-3 h-[inherit] !pt-[3pc]">
                <ScrollableChat messages={messages as IMessage[]} />
              </div>
            )}

            <Fieldset.Root>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={55}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                      background: "white",
                      border: "1px solid #0000000f",
                      filter: "drop-shadow(3px 4px 2px #00000010)",
                      borderRadius: "6pc",
                    }}
                  />
                </div>
              ) : null}

              <Fieldset.Content>
                <Field.Root>
                  <Input
                    name="message"
                    variant="subtle"
                    bg="#fff"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                    onKeyDown={handleSendMessage}
                    border="1px solid #ccc"
                  />
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Suspense>
  );
};

export default SingleChat;
