"use client";

import { toaster } from "@/src/components/ui/toaster";
import { useUserStore } from "@/src/store/userStore";
import { Button, Input, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import { useState } from "react";
import UserListItem from "../UserListItem";
import UserBadgeItem from "../UserBadgeItem";
import { IUser, useGetByName } from "@/src/services/user.service";
import { useCreateGroupChat } from "@/src/services/chat.service";

const GroupChatModal = ({ children }: { children: React.ReactNode }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUserStore.getState();
  const { data: searchResult, isLoading } = useGetByName(search);
  const { mutateAsync: createGroupChat } = useCreateGroupChat();

  const handleGroup = (userToAdd: any) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        duration: 5000,
        closable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser: any) => {
    setSelectedUsers(selectedUsers.filter((item) => item._id !== delUser._id));
  };

  const reset = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        duration: 5000,
        closable: true,
      });
      return;
    }

    try {
      const { data } = await createGroupChat({
        users: selectedUsers.map((u) => u._id) as string[],
        chatName: groupChatName,
      });

      if (data.message) {
        setIsOpen(false);
        reset();
        toaster.create({
          title: "New Group Chat Created!",
          description: data.message,
          type: "success",
          duration: 5000,
          closable: true,
        });
      }
    } catch (error: any) {
      toaster.create({
        title: "Failed to Create the Chat!",
        description: error?.response?.data || "Unknown error",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>
      <Dialog.Root
        open={isOpen}
        placement="center"
        motionPreset="slide-in-bottom"
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title className="text-2xl font-semibold font-sans">
                  Create Group Chat
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body paddingY={0}>
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Chat Name"
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Input
                    placeholder="Add Users eg: John, Piyush, Jane"
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {selectedUsers && (
                    <div className="flex flex-wrap w-full gap-2">
                      {selectedUsers.map((u) => (
                        <UserBadgeItem
                          key={u?._id as string}
                          user={u}
                          handleFunction={() => handleDelete(u)}
                        />
                      ))}
                    </div>
                  )}

                  {isLoading ? (
                    <div>Loading...</div>
                  ) : searchResult ? (
                    <div className="max-h-[180px] overflow-y-scroll flex flex-col gap-2">
                      {searchResult
                        ?.filter((item) => !selectedUsers.includes(item))
                        ?.map((user) => (
                          <UserListItem
                            key={user?._id as string}
                            user={user as IUser}
                            handleFunction={() => handleGroup(user)}
                          />
                        ))}
                    </div>
                  ) : null}
                </div>
              </Dialog.Body>
              <Dialog.Footer justifyContent="flex-start">
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleSubmit}>Submit</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default GroupChatModal;
