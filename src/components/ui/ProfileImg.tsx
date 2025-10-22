import { generateFilePath } from "@/src/services/url.service";
import { IUser } from "@/src/services/user.service";
import { Avatar, AvatarGroup } from "@chakra-ui/react";
import React from "react";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
export const pickPalette = (name: string) => {
  const index = name?.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

function ProfileImg({
  style,
  user,
  textStyle = {},
  fallback = "",
}: {
  style?: React.CSSProperties;
  user: IUser;
  textStyle?: React.CSSProperties;
  fallback?: string;
}) {
  return (
    <AvatarGroup>
      <Avatar.Root
        size="sm"
        shape="full"
        style={style}
        colorPalette={pickPalette(user?.name as string)}
      >
        <Avatar.Image
          src={generateFilePath(user?.pic as File)}
          alt={user?.name}
        />
        <Avatar.Fallback
          style={textStyle}
          className="!font-bold"
          name={fallback ? fallback : user?.name}
        />
      </Avatar.Root>
    </AvatarGroup>
  );
}

export default ProfileImg;
