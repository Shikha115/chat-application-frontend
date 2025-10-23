"use client";

import { toaster } from "@/src/components/ui/toaster";
import { FaEye } from "react-icons/fa";
import {
  Button,
  Input,
  Box,
  IconButton,
  Spinner,
  Dialog,
  Fieldset,
  Field,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import {  useState } from "react";
import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";
import { IUser, useGetByName } from "@/src/services/user.service";
import { useUserStore } from "@/src/store/userStore";
import { useChatStore } from "@/src/store/chatStore";
import {
  ChatApiResponse,
  IChat,
  useAddToGroup,
  useRemoveFromGroup,
  useUpdateChatById,
} from "@/src/services/chat.service";
import ProfileModal from "./ProfileModal";

const UpdateGroupChatModal = () => {
  const [search, setSearch] = useState("");

  const { user } = useUserStore();
  const { selectedChat, setSelectedChat } = useChatStore();
  const { data: searchResult, isLoading } = useGetByName(search);
  const { mutateAsync: updateChatById, isPending: renameloading } =
    useUpdateChatById();
  const { mutateAsync: addToGroup } = useAddToGroup();
  const { mutateAsync: removeFromGroup } = useRemoveFromGroup();

  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState<string>(
    selectedChat?.chatName || ""
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const reset = () => {
    setGroupChatName("");
    setSearch("");
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toaster.create({
        title: "Group Chat Name is required!",
        type: "error",
        duration: 2000,
        closable: true,
      });
      return;
    }

    try {
      const { data } = await updateChatById({
        id: selectedChat?._id as string,
        obj: { chatName: groupChatName },
      });
      if (data.message) {
        setSelectedChat(data.data as IChat);
        toaster.create({
          title: "Group Chat Renamed",
          description: data.message,
          type: "success",
          duration: 2000,
          closable: true,
        });
        reset();
        setIsOpen(false);
      }
    } catch (error: any) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  const handleAddUser = async (userId: any) => {
    if ((selectedChat?.users as IUser[]).find((u) => u?._id === userId?._id)) {
      toaster.create({
        title: "User Already in group!",
        description: "This user is already in the group.",
        type: "error",
        duration: 5000,
        closable: true,
      });
      return;
    }

    if (selectedChat?.groupAdmin !== user?._id) {
      toaster.create({
        title: "Only admins can add someone!",
        description: "Only admins can add someone!",
        type: "error",
        duration: 5000,
        closable: true,
      });

      return;
    }

    try {
      const { data } = await addToGroup({
        chatId: selectedChat?._id as string,
        userId: userId,
      });

      if (data.message) {
        const getData = data?.data as ChatApiResponse;
        const filterData = getData?.hasOwnProperty("_doc")
          ? (getData as any)?._doc
          : getData;
        setSelectedChat(filterData as IChat);
        // console.log(filterData, "data.data in addToGroup");
        toaster.create({
          title: "User Added",
          description: data.message,
          type: "success",
          duration: 5000,
          closable: true,
        });
      }
    } catch (error: any) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  const handleRemove = async (userId: string) => {
    // Trying to remove self
    if (userId === user?._id) {
      if (selectedChat?.groupAdmin === user?._id) {
        toaster.create({
          title: "You are the group admin",
          description: "You must transfer admin rights before leaving.",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }

      // Confirmation before removing self
      toaster.create({
        title: "Leave Group?",
        description: "You will not be able to rejoin unless added again.",
        type: "warning",
        closable: true,
        duration: 5000,
        action: {
          label: "Yes, Leave",
          onClick: () => removeUserFromGroup(userId), // 🔁 Call API from here only
        },
      });

      return;
    }

    // Trying to remove someone else — must be admin
    if (selectedChat?.groupAdmin !== user?._id) {
      toaster.create({
        title: "Only admins can remove someone!",
        type: "error",
        duration: 5000,
        closable: true,
      });
      return;
    }

    // Admin removing someone else
    removeUserFromGroup(userId); // 🔁 Directly call helper
  };

  const removeUserFromGroup = async (userId: string) => {
    try {
      const { data } = await removeFromGroup({
        chatId: selectedChat?._id as string,
        userId,
      });

      if (data.message) {
        const getData = data?.data as ChatApiResponse;
        const filterData = getData?.hasOwnProperty("_doc")
          ? (getData as any)?._doc
          : getData;
        setSelectedChat(filterData as IChat);
        // console.log(filterData, "data.data in removeFromGroup");

        const isSelfRemoval = userId === user?._id;
        toaster.create({
          title: isSelfRemoval ? "Left Group" : "User Removed",
          description: data.message,
          type: "success",
          duration: 2000,
          closable: true,
        });

        if (isSelfRemoval) {
          setIsOpen(false);
          setSelectedChat(null);
          reset();
        }
      }
    } catch (error: any) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Something went wrong",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  // console.log(selectedChat, "selectedChat");

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={() => setIsOpen(true)}
        className="btn-teal"
        style={{
          height: "35px",
          minWidth: "35px",
        }}
      >
        <FaEye className="!w-[16px]" />
      </IconButton>

      <Dialog.Root
        open={isOpen}
        onOpenChange={(e: { open: boolean }) => setIsOpen(e.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title className="!text-2xl font-bold font-sans text-center w-full">
                  {selectedChat?.chatName}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box className="flex flex-wrap w-full gap-2 !pb-3 ">
                  {(selectedChat?.users as IUser[])?.map((u) => (
                    <UserBadgeItem
                      key={u?._id}
                      user={u}
                      admin={selectedChat?.groupAdmin === u._id}
                      handleFunction={() => {
                        setSelectedUser(u);
                        setShowProfileModal(true);
                      }}
                    />
                  ))}
                </Box>
                <Fieldset.Root className="w-full !mb-4">
                  <Fieldset.Content>
                    <Field.Root className="mb-3" flexDirection="row">
                      <Input
                        placeholder="Chat Name"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                      <Button
                        variant="solid"
                        colorScheme="teal"
                        loading={renameloading}
                        onClick={handleRename}
                        className="mt-2"
                      >
                        Update
                      </Button>
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
                <Fieldset.Root className="">
                  <Fieldset.Content>
                    <Field.Root>
                      <Input
                        placeholder="Add User to group"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
                {isLoading ? (
                  <Spinner size="lg" />
                ) : searchResult ? (
                  <div className="max-h-[180px] overflow-y-scroll flex flex-col gap-2 !mt-2">
                    {searchResult
                      ?.filter(
                        (item) =>
                          !(selectedChat?.users as IUser[]).some(
                            (u) => u._id === item._id
                          )
                      )
                      ?.map((user) => (
                        <UserListItem
                          key={user?._id as string}
                          user={user as IUser}
                          handleFunction={() => handleAddUser(user)}
                        />
                      ))}
                  </div>
                ) : null}
              </Dialog.Body>
              <Dialog.Footer justifyContent="flex-start">
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={() => handleRemove(user?._id as string)}>
                  Leave Group
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <ProfileModal
        isOpen={showProfileModal}
        setIsOpen={setShowProfileModal}
        user={selectedUser as IUser}
      >
        {!(selectedChat?.groupAdmin === selectedUser?._id) && (
          <Button
            onClick={() => handleRemove(selectedUser?._id as string)}
            className="btn-teal"
          >
            Remove
          </Button>
        )}
      </ProfileModal>
    </>
  );
};

export default UpdateGroupChatModal;
