"use client";

import { FaBell, FaSearch } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { useState } from "react";
import { toaster } from "@/src/components/ui/toaster";
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  IconButton,
  Input,
  Menu,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Tooltip } from "@/src/components/ui/tooltip";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { useUserStore } from "@/src/store/userStore";
import { IUser, useGetByName } from "@/src/services/user.service";
import ProfileModal from "./(models)/ProfileModal";
import { useRouter } from "next/navigation";
import ProfileImg from "@/src/components/ui/ProfileImg";
import { IChat, useAccessChat } from "@/src/services/chat.service";
import { useChatStore } from "@/src/store/chatStore";
import { getSender } from "@/src/components/logics/chat.logic";

function SideDrawer() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { data: searchedUser, isLoading } = useGetByName(search);
  const { mutateAsync: accessChat, isPending: loadingChat } = useAccessChat();
  const { user, clearUser } = useUserStore();
  const { setSelectedChat, setChats, chats } = useChatStore();
  const { notifications, setNotifications } = useUserStore();

  const logoutHandler = () => {
    try {
      router.push("/");
      localStorage.removeItem("token");
      clearUser();
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const handleAccessChat = async (userId: any) => {
    try {
      const { data } = await accessChat(userId as string);
      if (data.message) {
        const arr = data.data as IChat;
        console.log("Chat accessed successfully", data);
        setIsOpen(false);
        setSelectedChat(arr);
        if (!chats.find((item) => item._id === arr._id)) {
          setChats([arr, ...chats]);
        }
      }
    } catch (err: any) {
      toaster.create({
        title: "Error fetching the chat",
        description:
          (err as any).response?.data?.message ??
          err.message ??
          "Unknown error",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  console.log(notifications, "notifications");

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#ffffffab"
        w="100%"
        p="5px 10px 5px 10px"
      >
        <div className="flex gap-2">
          <Tooltip
            content="Search Users to chat"
            showArrow
            positioning={{ placement: "bottom-end" }}
          >
            <Button variant="surface" onClick={() => setIsOpen(true)}>
              <FaSearch className="!w-[14px]" />
              <Text display={{ base: "none", md: "flex" }}>Search User</Text>
            </Button>
          </Tooltip>
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Search database"
            onClick={() => setSelectedChat(null)}
            backgroundColor="#ffffffab"
            color="#000"
            style={{
              minWidth: "40px",
            }}
          >
            <FaBarsStaggered />
          </IconButton>
        </div>
        <Text fontSize="2xl">
          <span className="primary">SJ</span>
          <span className="primary-dark"> Connect</span>
        </Text>
        <div className="flex items-center gap-2">
          {/* //notification */}
          <Menu.Root>
            <Menu.Trigger>
              <Box p={1} position="relative" cursor="pointer">
                {notifications.length > 0 && (
                  <div className="absolute top-0 right-0 !bg-red-600 rounded-full text-white h-4 w-4 !text-[10px]">
                    {notifications.length}
                  </div>
                )}
                <FaBell fontSize="2xl" style={{ margin: "4px" }} />
              </Box>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content>
                {notifications.length === 0 ? (
                  <Menu.Item value="no-new-messages" disabled>
                    No New Messages
                  </Menu.Item>
                ) : (
                  notifications?.map((notif: any) => (
                    <Menu.Item
                      value={notif?._id}
                      key={notif?._id}
                      onSelect={() => {
                        setSelectedChat(notif.chat);
                        setNotifications(
                          notifications.filter(
                            (n) => (n?.chat as IChat)?._id !== notif?.chat?._id
                          )
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `${notif.chat.chatName}: ${notif?.sender?.name}: ${notif?.content}`
                        : `${notif?.sender?.name}: ${notif?.content}`}
                    </Menu.Item>
                  ))
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          {/* profile */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <div>
                <ProfileImg
                  style={{ cursor: "pointer" }}
                  user={user as IUser}
                />
              </div>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="profile" asChild cursor="pointer">
                  <div onClick={() => setShowProfileModal(true)}>
                    My Profile
                  </div>
                </Menu.Item>

                <Menu.Separator />
                <Menu.Item
                  value="logout"
                  onSelect={logoutHandler}
                  cursor="pointer"
                >
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </div>
      </Box>

      <Drawer.Root
        placement="start"
        open={isOpen}
        onOpenChange={(e) => {
          setIsOpen(e.open);
          setSearch("");
        }}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header className="border-b">
                <Drawer.Title>Search Users</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <div className="flex gap-2 pb-2">
                  <Input
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {/* <Button variant="solid" onClick={handleSearch}>
                    Go
                  </Button> */}
                </div>

                <div className="flex flex-col gap-2 !mt-4">
                  {isLoading ? (
                    <ChatLoading />
                  ) : (
                    searchedUser?.map((user) => (
                      <UserListItem
                        key={user?._id}
                        user={user}
                        handleFunction={() =>
                          handleAccessChat(user._id as string)
                        }
                      />
                    ))
                  )}
                  {loadingChat && <Spinner className="ml-auto flex" />}
                </div>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <ProfileModal
        isOpen={showProfileModal}
        setIsOpen={setShowProfileModal}
        user={user as IUser}
      />
    </>
  );
}

export default SideDrawer;
