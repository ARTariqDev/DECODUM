"use client";
// import { useActionState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImSpinner2 } from "react-icons/im";

function LoginPage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    const formData = new FormData(e.target);
    const hasTeamID = formData.get("teamID");
    const hasPassword = formData.get("password");

    if (hasTeamID && hasPassword) {
      setIsLoading(true);
      setError({});

      const res = await fetch("/api/auth", {
        method: "POST",
        body: formData,
      });
      setIsLoading(false);

      if (!res.ok) {
        const error = await res.json();
        console.error("Login Error:", error);
        setError(error);
      } else {
        router.push("/tasks");
      }
    } else {
      setError({
        teamID: !hasTeamID && "TeamID is required!",
        password: !hasPassword && "Password is required!",
      });
    }
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4 container">
      <form
        onSubmit={handleSubmit}
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

        {isLoading ? (
          <ImSpinner2 className="animate-spin text-4xl mt-6 text-white/70" />
        ) : (
          <>
            <div className="w-full relative">
              <Input
                type="text"
                placeholder="TeamID"
                icon={faUser}
                name="teamID"
              />
              {error?.teamID && (
                <p className="text-red-500 text-xs sm:text-sm absolute pt-2 w-full text-center">
                  {error.teamID}
                </p>
              )}
            </div>
            <div className="w-full mt-2.5 relative">
              <Input
                type="text"
                placeholder="Password"
                icon={faLock}
                name="password"
              />
              {(error?.password || error?.message) && (
                <p className="text-red-500 text-xs sm:text-sm absolute pt-2 text-center w-full">
                  {error.message || error.password}
                </p>
              )}
            </div>
          </>
        )}

        <div className="w-full mt-10">
          <Button
            text="Login"
            bgColor="#fff8de"
            textColor="#111"
            disabled={isLoading}
            className="disabled:opacity-50 disabled:pointers-events-none"
          />
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
