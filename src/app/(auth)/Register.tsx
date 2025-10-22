"use client";

import { toaster } from "@/src/components/ui/toaster";
import { useRegisterUser } from "@/src/services/user.service";
import { Button, Field, Fieldset, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: registerUser, isPending } = useRegisterUser();

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPic(null);
  };

  const submitHandler = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        toaster.create({
          title: "Please fill all the fields",
          type: "warning",
          duration: 5000,
        });
        return;
      }

      if (password !== confirmPassword) {
        toaster.create({
          title: "Passwords do not match",
          type: "error",
          duration: 5000,
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (pic) {
        formData.append("pic", pic);
      }

      const { data } = await registerUser(formData);
      if (data.message) {
        reset();
        toaster.create({
          title: "Registration successful",
          description: data.message,
          type: "success",
          duration: 3000,
        });
        // router.push("/chats");
        setActiveTab("login");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toaster.create({
        title: "Registration failed",
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
          <Field.Label>Name</Field.Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email Address</Field.Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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

        <Field.Root>
          <Field.Label>Confirm Password</Field.Label>
          <div className="relative w-full">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-16"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-1 cursor-pointer right-2 !px-2 !text-sm !text-gray-600 !bg-gray-200 rounded hover:!bg-gray-300 transition"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field.Root>

        <Field.Root>
          <Field.Label>Upload Image</Field.Label>
          <Input
            type="file"
            accept="image/*"
            max={1}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPic(file);
            }}
          />
        </Field.Root>

        <Button
          onClick={submitHandler}
          loading={isPending}
          className="btn btn-teal btn-block"
        >
          Register
        </Button>
      </Stack>
    </Fieldset.Root>
  );
}
