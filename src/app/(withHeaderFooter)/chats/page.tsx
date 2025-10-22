"use client";

import { useUserStore } from "@/src/store/userStore";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import SideDrawer from "./(components)/SideDrawer";
import MyChats from "./(components)/MyChats";
import Chatbox from "./(components)/Chatbox";

const Page = () => {
  const { user } = useUserStore();

  // pending transfer admin rights functionality
  // delete a group

  // console.log(user, "user");

  return (
    <div style={{ width: "100%" }}>
      {/* hii */}
      {user && <SideDrawer />}
      <Box
        display="flex"
        gap={2}
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && (
          <Chatbox  />
        )}
      </Box>
    </div>
  );
};

export default Page;
