"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "../../../lib/auth";

function CallbackHandler() {
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

export default function AuthCallback() {
  return (
    <Suspense fallback={<p style={{ color: "#aaa" }}>Loading...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}