import { IChat } from "./chat.service";
import { IUser } from "./user.service";
import authAxios, { GeneralApiResponse } from "./url.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const prefix = "/message";

export interface IMessage {
  _id?: string;
  readBy?: string[];
  sender?: string | IUser;
  content?: string;
  chat?: string | IChat;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageApiHook = () => {
  const fetchMessages = async (chatId: string) => {
    return authAxios.get<GeneralApiResponse<IMessage[]>>(`${prefix}/${chatId}`);
  };
  const sendMessage = async (obj: { content: string; chat: string }) => {
    return authAxios.post<GeneralApiResponse<IMessage>>(`${prefix}/`, obj);
  };

  return { fetchMessages, sendMessage };
};

export const useFetchMessages = ( chatId: string) => {
  const api = MessageApiHook();

  return useQuery({
    queryKey: ["get", "messages", chatId],
    queryFn: () =>
      api.fetchMessages(chatId).then((res) => res.data.data),
    enabled: !!chatId,
  });
};

export const useSendMessages = () => {
  const api = MessageApiHook();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["get", "chats"] });
    },
  });
};

