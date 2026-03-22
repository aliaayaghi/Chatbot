"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "../../../lib/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      router.push("/");
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <p style={{ color: "#aaa" }}>Signing you in...</p>
    </main>
  );
}