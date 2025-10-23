import { IMessage } from "@/src/services/message.service";
import { IUser } from "@/src/services/user.service";

export const getSender = (loggedUser: IUser, users: IUser[]) => {
  return users.find((u) => u._id !== loggedUser._id) || "Unknown User";
};

export const isSameSender = (
  m: IMessage,
  i: number,
  messages: IMessage[],
  userId: string
) => {
  const MessageLength = messages.length - 1;
  const nextMessageId = (messages[i + 1]?.sender as IUser)?._id;
  const currentMessageId = (m?.sender as IUser)?._id;
  /* Conditions
  index < message length = dont check for last message
  nextmessageId !== currentMessageId = next message is from  different user
  nextmessageId is undefined = next message doesn;t exist
 not loggedin user 
   */
  return (
    i < MessageLength &&
    (nextMessageId !== currentMessageId || nextMessageId === undefined) &&
    currentMessageId !== userId
  );
};

export const isLastMessage = (
  messages: IMessage[],
  i: number,
  userId: string
) => {
  const MessageLength = messages.length - 1;
  const lastMessageId = (messages[MessageLength]?.sender as IUser)?._id;
  /*
  its a last index and last message exist
  not from logged in user
   */
  return i === MessageLength && lastMessageId !== userId && lastMessageId;
};
