"use client";

import { useActionState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { loginAction } from "@/actions/auth";

function LoginPage() {
  const [error, Action, pending] = useActionState(loginAction, {
    message: "",
  });
  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4 container">
      <form
        action={Action}
        className="flex flex-col items-center p-6 px-14 rounded-lg max-w-[600px] w-[90vw] backdrop-blur-sm"
        style={{
          animation: "border-glow 2s linear infinite alternate",
          fontFamily: "Anta-Regular, monospace",
        }}
      >
        <h1
          style={{
            fontFamily: "Anta-Regular, monospace",
            WebkitTextStroke: "2px #fff8de",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            textShadow: "0 0 8px #fff8de",
            animation: "glow 2s ease-in-out infinite alternate",
            whiteSpace: "nowrap",
            transform: "scaleY(1.3)",
            transformOrigin: "center",
          }}
          className="text-center text-[clamp(2rem,6vw,8rem)]"
        >
          Login
          <span
            className="animate-pulse ml-1"
            style={{
              WebkitTextStroke: "inherit",
              WebkitTextFillColor: "transparent",
            }}
          >
            |
          </span>
        </h1>

        <Input type="text" placeholder="TeamID" icon={faUser} name="teamID" />
        {error?.teamID && (
          <p className="text-red-500 text-sm mt-3">{error.teamID}</p>
        )}
        <Input
          type="text"
          placeholder="Password"
          icon={faLock}
          name="password"
        />
        {(error?.password || error?.message) && (
          <p className="text-red-500 text-sm mt-3">
            {error.message || error.password}
          </p>
        )}
        <div className="w-full mt-5">
          <Button text="Login" bgColor="#fff8de" textColor="#111" />
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
