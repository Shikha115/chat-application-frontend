"use client";
import { useEffect } from "react";
import { useGetCurrentUser } from "../../services/user.service";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";

export default function LoadUser() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetCurrentUser();
  const { setUser } = useUserStore();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      setUser(user);
    } else if (isError) {
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [isLoading, user, isError, router]);

  return null;
}
