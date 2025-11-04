import { formatDate, formatTime } from "@/src/components/formatDate";
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
import { useMemo } from "react";
import ScrollableFeed from "react-scrollable-feed";

// profile picture will be shown for other users not logged in
// profile picture will be shown at the end of all messages
const ScrollableChat = ({ messages }: { messages: IMessage[] }) => {
  const { user } = useUserStore();

  // Group messages by date but preserve original message index so chat logic functions
  // that expect the index within the original messages array still work.
  const grouped = useMemo(() => {
    const map = new Map<string, { msg: IMessage; idx: number }[]>();
    for (let idx = 0; idx < (messages ?? []).length; idx++) {
      const m = messages![idx];
      const k = formatDate(m.createdAt as Date);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push({ msg: m, idx });
    }
    return Array.from(map) as [string, { msg: IMessage; idx: number }[]][];
  }, [messages]);

  return (
    <ScrollableFeed className="flex flex-col gap-1">
      {grouped &&
        grouped.map(([date, msgs]) => {
          return (
            <div key={date} className="flex flex-col gap-2">
              <span className="text-center !font-medium rounded-full !px-3 !py-[3px] !mt-2 !text-[11px] bg-white w-max !mx-auto">{date}</span>
              {msgs.map(({ msg, idx }) => {
                const sender = msg?.sender as IUser;
                const showAvatar =
                  isSameSender(msg, idx, messages, user?._id as string) ||
                  isLastMessage(messages, idx, user?._id as string);

                return (
                  <div
                    className={`flex items-center gap-1 ${
                      sender._id === user?._id ? "justify-end" : ""
                    }`}
                    key={msg._id}
                  >
                    {showAvatar ? (
                      <Tooltip content={sender?.name}>
                        <Avatar.Root
                          colorPalette={pickPalette(sender?.name as string)}
                          border="2px solid #fff"
                        >
                          <div className="">
                            {/* <Avatar.Fallback>
                        {(sender?.name as string)}
                      </Avatar.Fallback> */}
                            <Avatar.Fallback name={sender?.name} />
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
                        display: "flex",
                        flexDirection:
                          (msg?.content as string)?.length > 20
                            ? "column"
                            : "row",
                        gap:
                          (msg?.content as string)?.length > 20 ? "0px" : "4px",
                        alignItems: "flex-end",
                      }}
                    >
                      {msg.content}
                      <span className="!text-[11px] !text-gray-500">
                        {formatTime(msg?.createdAt as Date)}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

{
  /* {selectedChat?.isGroupChat && (
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
)} */
}
