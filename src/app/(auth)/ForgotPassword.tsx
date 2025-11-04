"use client";
import { toaster } from "@/src/components/ui/toaster";
import { ILogin, useForgetPassword } from "@/src/services/user.service";
import { Button, Field, Fieldset, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

export default function ForgotPassword({
  setForgotPassword,
}: {
  setForgotPassword: (value: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const { mutateAsync: loginUser, isPending } = useForgetPassword();
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
        toaster.create({
          title: "Password reset successful",
          description: data.message,
          type: "success",
        });
        setForgotPassword(false);
        reset();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toaster.create({
        title: "Error Occured!",
        description: message,
        type: "error",
        duration: 5000,
      });
    }
  };
  return (
    <>
      <h1 className="!mb-4 primary-dark !text-2xl !font-bold">
        Forgot Password
      </h1>
      <Fieldset.Root className="w-full">
        <Stack gap={4}>
          <Field.Root>
            <Field.Label>Email Address</Field.Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
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

          <p
            onClick={() => setForgotPassword(false)}
            className="!font-medium !text-[13px] !text-blue-500 !underline cursor-pointer"
          >
            Go back to login
          </p>

          <Button
            onClick={submitHandler}
            loading={isPending}
            className="btn btn-teal btn-block"
          >
            Submit
          </Button>
        </Stack>
      </Fieldset.Root>
    </>
  );
}
