"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4 container">
      <form
        className="flex flex-col items-center p-6 px-14 rounded-lg w-[35vw] max-w-[600px] min-w-[400px] backdrop-blur-sm"
        style={{
          animation: "border-glow 2s linear infinite alternate",
          fontFamily: "anta-regular, monospace",
        }}
      >
        <h1
          className="text-center text-[clamp(2rem,6vw,8rem)] tracking-wide"
          style={{
            WebkitTextStroke: "2px #fff8de",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            textShadow: "0 0 8px #fff8de",
            animation: "glow 2s ease-in-out infinite alternate",
            whiteSpace: "nowrap",
          }}
        >
          Login
        </h1>
        <Input type="text" placeholder="TeamID" icon={faUser} />
        <Input type="text" placeholder="Password" icon={faLock} />
        <div className="w-full mt-8">
          <Button text="Login" bgColor="#fff8de" textColor="#111" />
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
