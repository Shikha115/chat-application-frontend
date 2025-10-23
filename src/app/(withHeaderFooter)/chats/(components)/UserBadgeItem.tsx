import { FaTimes } from "react-icons/fa";
import { Badge } from "@chakra-ui/react";
import { pickPalette } from "@/src/components/ui/ProfileImg";

const UserBadgeItem = ({ user, handleFunction, admin }: any) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      colorPalette={pickPalette(user.name)}
    >
      {user.name}
      {admin && <span> (Admin)</span>}
      {!admin && <FaTimes style={{ paddingLeft: "4px" }} />}
    </Badge>
  );
};

export default UserBadgeItem;
