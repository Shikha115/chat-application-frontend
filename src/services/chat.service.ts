import authAxios, { GeneralApiResponse } from "./url.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "./user.service";
import { IMessage } from "./message.service";
const prefix = "/chat";

export interface IChat {
  _id?: string;
  chatName?: string;
  isGroupChat?: boolean;
  users?: IUser[] | string[];
  latestMessage?: IMessage | string | null;
  groupAdmin?: string | null;
  recentlyAdded?: string | null;
  recentlyRemoved?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ChatApiResponse = { _doc: IChat } | IChat;

const ChatApiHook = () => {
  const fetchChats = async () => {
    return authAxios.get<GeneralApiResponse<IChat[]>>(`${prefix}/`);
  };
  const accessChat = async (userId: string) => {
    return authAxios.post<GeneralApiResponse<IChat>>(`${prefix}/`, {
      userId,
    });
  };
  const createGroupChat = async (obj: {
    users: string[];
    chatName: string;
  }) => {
    return authAxios.post<GeneralApiResponse<IChat[]>>(`${prefix}/group`, obj);
  };
  const updateById = async ({ id, obj }: { id: string; obj: IChat }) => {
    return authAxios.patch<GeneralApiResponse<IChat>>(
      `${prefix}/rename/${id}`,
      obj
    );
  };
  const removeFromGroup = async (obj: { chatId: string; userId: string }) => {
    return authAxios.patch<GeneralApiResponse<ChatApiResponse>>(
      `${prefix}/groupremove`,
      obj
    );
  };
  const addToGroup = async (obj: { chatId: string; userId: string }) => {
    return authAxios.patch<GeneralApiResponse<ChatApiResponse>>(
      `${prefix}/groupadd`,
      obj
    );
  };

  return {
    fetchChats,
    accessChat,
    createGroupChat,
    updateById,
    removeFromGroup,
    addToGroup,
  };
};

export const useFetchChats = () => {
  const api = ChatApiHook();

  return useQuery({
    queryKey: ["get", "chats"],
    queryFn: () => api.fetchChats().then((res) => res.data.data),
    enabled: true,
  });
};

export const useAccessChat = () => {
  const api = ChatApiHook();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.accessChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "chats"] });
    },
  });
};

export const useCreateGroupChat = () => {
  const api = ChatApiHook();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createGroupChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "chats"] });
    },
  });
};

export const useUpdateChatById = () => {
  const api = ChatApiHook();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get", "chats"] }); // fetchs chats of current user if a group chat is updated
      queryClient.invalidateQueries({ queryKey: ["get", "messages"] }); // fetches messages when chat is updated
    },
  });
};

export const useRemoveFromGroup = () => {
  const api = ChatApiHook();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.removeFromGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get", "chats"] });
      queryClient.invalidateQueries({ queryKey: ["get", "messages"] }); // fetches messages when chat is updated
    },
  });
};

export const useAddToGroup = () => {
  const api = ChatApiHook();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.addToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "chats"] });
    },
  });
};
