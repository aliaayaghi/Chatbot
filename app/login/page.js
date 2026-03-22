"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../../lib/api";
import { setToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");   // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit() {
    if (!email || !password) return;

     if (mode === "register" && password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }
    setLoading(true);
    setError("");

    try {
      const data = mode === "login"
        ? await loginUser(email, password)
        : await registerUser(email, password);

      setToken(data.token);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    // Redirect to Flask which redirects to Google
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {mode === "register" && (
  <input
    style={styles.input}
    type="password"
    placeholder="Confirm password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
  />
)}

        <button
          style={styles.btn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <div style={styles.divider}>or</div>

        <button style={styles.googleBtn} onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <p style={styles.toggle}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            style={styles.link}
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setConfirmPassword("");  }}
          >
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  error: {
    backgroundColor: "#fff0f0",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "15px",
    fontFamily: "inherit",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  btn: {
    padding: "12px",
    backgroundColor: "#4a90d9",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  divider: {
    textAlign: "center",
    color: "#aaa",
    fontSize: "13px",
  },
  googleBtn: {
    padding: "12px",
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  toggle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  link: {
    color: "#4a90d9",
    cursor: "pointer",
  },
};