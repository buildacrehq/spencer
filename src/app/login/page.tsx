"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const { error: message } = await res.json();
        setError(message || "Incorrect password.");
        setBusy(false);
        return;
      }
      router.push(searchParams.get("next") || "/");
      router.refresh();
    } catch {
      setError("Something went wrong — try again.");
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--sand)",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--paper)",
          borderRadius: 20,
          boxShadow: "0 30px 70px -25px rgba(28,35,33,0.4), 0 4px 16px rgba(28,35,33,0.1)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
        }}
      >
        <Image
          src="/logo-full.png"
          alt="BuildAcre"
          width={934}
          height={401}
          style={{ maxWidth: 200, width: "100%", height: "auto", display: "block", margin: "0 auto 28px auto" }}
          priority
        />
        <label
          style={{
            display: "block",
            fontSize: 10.5,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            marginBottom: 8,
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          Team Password
        </label>
        <input
          className="field-input"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}
        />
        {error && (
          <p style={{ color: "var(--danger)", fontSize: 13, marginTop: -8, marginBottom: 16, textAlign: "left" }}>
            {error}
          </p>
        )}
        <button type="submit" className="tbtn tbtn-teal" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
