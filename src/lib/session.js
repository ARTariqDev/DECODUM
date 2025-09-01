import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

//TODO: Change the secret word and add it to the env file later
const secretWord = "my_secret";
const secret = new TextEncoder().encode(secretWord);

async function createJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

//TODO: expiration time is 24h. Change it later.
export async function createSession(TeamId) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await createJWT({ TeamId, expiresAt });
  const c = await cookies();
  c.set("session", session, {
    httpOnly: true,
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "lax"
  });
}

export async function verifyJWT(session) {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session");
    return null;
  }
}

// in case we want to log out
export async function deleteSession() {
  const c = await cookies();
  c.delete("session");
}
