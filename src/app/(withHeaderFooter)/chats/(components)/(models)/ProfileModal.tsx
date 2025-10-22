"use client";

import { IUser } from "@/src/services/user.service";
import {
  Dialog,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import ProfileImg from "@/src/components/ui/ProfileImg";

const ProfileModal = ({
  user,
  setIsOpen = () => {},
  isOpen = false,
  children,
}: {
  user: IUser;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Dialog.Root
      size="sm"
      open={isOpen}
      onOpenChange={(openState: { open: boolean }) => setIsOpen(openState.open)}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "20px",
                flexDirection: "column",
              }}
            >
              <Dialog.Title
                style={{
                  fontSize: "30px",
                }}
                className=" !font-medium"
              >
                {user?.name}
              </Dialog.Title>
              <ProfileImg
                style={{
                  borderRadius: "9999px",
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  boxShadow: "0 0 10px 8px #25D36650",
                  border: "2px solid #fff",
                }}
                textStyle={{ fontSize: 80 }}
                user={user as IUser}
              />

              <p style={{ fontSize: "20px" }}>{user?.email}</p>
              {children}
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;
