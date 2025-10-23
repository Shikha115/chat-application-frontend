import {
  isLastMessage,
  isSameSender,
} from "@/src/components/logics/chat.logic";
import { pickPalette } from "@/src/components/ui/ProfileImg";
import { Tooltip } from "@/src/components/ui/tooltip";
import { IMessage } from "@/src/services/message.service";
import { generateFilePath } from "@/src/services/url.service";
import { IUser } from "@/src/services/user.service";
import { useUserStore } from "@/src/store/userStore";
import { Avatar } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";

// profile picture will be shown for other users not logged in
// profile picture will be shown at the end of all messages
const ScrollableChat = ({ messages }: { messages: IMessage[] }) => {
  const { user } = useUserStore();


 
  return (
    <ScrollableFeed className="flex flex-col gap-1">
      {messages &&
        messages.map((m: IMessage, i: number) => {
          const sender = m?.sender as IUser;
          return (
            <div
              className={`flex items-center gap-1 ${
                sender._id === user?._id ? "justify-end" : ""
              }`}
              key={m._id}
            >
              {isSameSender(m, i, messages, user?._id as string) ||
              isLastMessage(messages, i, user?._id as string) ? (
                <Tooltip content={sender?.name}>
                  <Avatar.Root
                    colorPalette={pickPalette(sender?.name as string)}
                    border="2px solid #fff"
                  >
                    <div className="">
                      <Avatar.Fallback>
                        {(sender?.name as string)?.[0]}S
                      </Avatar.Fallback>
                      <Avatar.Image
                        src={generateFilePath(sender?.pic as File)}
                        alt={sender?.name as string}
                      />
                    </div>
                  </Avatar.Root>
                </Tooltip>
              ) : (
                sender._id !== user?._id && (
                  <div className="h-[36px] w-[36px]"></div>
                )
              )}
              <span
                style={{
                  backgroundColor: `${
                    sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0"
                  }`,

                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  height: "fit-content",
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

{/* {selectedChat?.isGroupChat && (
  <div className="flex justify-center !text-[14px] !font-medium">
    {addedUser && (
      <div className="flex items-center gap-1 justify-center bg-primary py-1 px-2  text-white rounded-xl text-center w-[50%] mx-auto">
        <span className="font-semibold">Added:</span>
        <span>{addedUser.name}</span>
      </div>
    )}
    {removedUser && (
      <div className="flex items-center gap-1 justify-center bg-primary py-1 px-2  text-white rounded-xl w-[50%] text-center">
        <span className="font-semibold">Removed:</span>
        <span>{removedUser.name}</span>
      </div>
    )}
  </div>
)} */}