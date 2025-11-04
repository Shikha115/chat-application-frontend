"use client";
import { Box, Container, Tabs } from "@chakra-ui/react";
import { LuUser, LuFolder } from "react-icons/lu";
import Login from "../(auth)/Login";
import Register from "../(auth)/Register";
import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "next/navigation";
import ForgotPassword from "../(auth)/ForgotPassword";

export default function Homepage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false)

  const tabs = [
    {
      name: "Login",
      value: "login",
      component: <Login setForgotPassword={setForgotPassword} />,
      icon: <LuUser />,
    },
    {
      name: "Register",
      value: "register",
      component: <Register setActiveTab={setActiveTab} />,
      icon: <LuFolder />,
    },
  ];

  useEffect(() => {
    if (user) {
      router.push("/chats");
    }
  }, [user, router]);

  return (
    <div className="">
      <Container maxW="xl" centerContent className="h-screen">
        <LogoTitle />

        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          {!forgotPassword ? (
            <Tabs.Root
              activationMode="manual"
              defaultValue="login"
              value={activeTab}
              onValueChange={(details) => setActiveTab(details.value)}
              variant="subtle"
            >
              <Tabs.List className="flex w-full !border-0 overflow-hidden">
                {tabs.map((item) => (
                  <Tabs.Trigger
                    key={item.value}
                    value={item.value}
                    className={`w-1/2 flex items-center justify-center gap-2 py-2 font-medium transition
            ${
              activeTab === item.value
                ? "!bg-[#37e1e15c] primary !font-semibold"
                : "text-secondary hover:bg-primary-dark hover:text-white"
            }
          `}
                  >
                    {item.icon}
                    {item.name}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {tabs.map((item) => (
                <Tabs.Content key={item.value} value={item.value}>
                  {item.component}
                </Tabs.Content>
              ))}
            </Tabs.Root>
          ) : (
            <ForgotPassword setForgotPassword={setForgotPassword} />
          )}
        </Box>
      </Container>{" "}
    </div>
  );
}

const LogoTitle = () => {
  return (
    <Box
      p={5}
      className="bg-surface border border-primary shadow-md text-center rounded-lg"
      w="100%"
      mb="4"
      mt="8"
    >
      {/* Logo Title */}
      <Box
        as="h1"
        className="font-bold tracking-wide flex items-center justify-center gap-2"
        fontSize={{ base: "xlp.e", lg: "3xl" }}
      >
        <span className="primary">SJ</span>
        <span className="primary-dark">Connect</span>
        <span className="accent text-lg font-normal">•</span>
        <span className="text-secondary text-sm italic">Talk & Share</span>
      </Box>

      {/* Tagline */}
      <p className="text-secondary text-sm mt-4">
        Where conversations turn into connections
      </p>
    </Box>
  );
};
