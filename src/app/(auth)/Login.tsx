"use client";

import { toaster } from "@/src/components/ui/toaster";
import { ILogin, IUser, useLoginUser } from "@/src/services/user.service";
import { useUserStore } from "@/src/store/userStore";
import { Button, Field, Fieldset, Input, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login({
  setForgotPassword,
}: {
  setForgotPassword: (value: boolean) => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: loginUser, isPending } = useLoginUser();
  const { setUser } = useUserStore.getState();

  const reset = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const submitHandler = async () => {
    try {
      if (!email || !password) {
        toaster.create({
          title: "Please fill all the fields",
          type: "warning",
          duration: 5000,
        });
        return;
      }
      const obj: ILogin = {
        email,
        password,
      };
      const { data } = await loginUser(obj);
      if (data.message) {
        localStorage.setItem("token", data?.data?.token as string);
        toaster.create({
          title: "Login successful",
          description: data.message,
          type: "success",
        });
        setUser(data?.data?.user as IUser);
        reset();
        router.push("/chats");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toaster.create({
        title: "Login failed",
        description: message,
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Fieldset.Root className="w-full">
      <Stack gap={4}>
        <Field.Root>
          <Field.Label>Email Address</Field.Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field.Root>

        <Field.Root>
          <Field.Label className="flex items-center justify-between w-full">
            Password
            <span
              onClick={() => setForgotPassword(true)}
              className="font-bold !text-blue-500 cursor-pointer"
            >
              Forgot Password
            </span>
          </Field.Label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-1 cursor-pointer right-2 !px-2 !text-sm !text-gray-600 !bg-gray-200 rounded hover:!bg-gray-300 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field.Root>

        {/* <Field.Root className="!items-center">
          <Field.Label
            onClick={() => {
              setEmail("guest@example.com");
              setPassword("123456");
            }}
            className="text-center cursor-pointer"
          >
            Get <span>Guest User</span> Credentials
          </Field.Label>
        </Field.Root> */}

        <Button
          onClick={submitHandler}
          loading={isPending}
          className="btn btn-teal btn-block"
        >
          Login
        </Button>
      </Stack>
    </Fieldset.Root>
  );
}
