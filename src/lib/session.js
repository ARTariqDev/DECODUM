import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretWord = "my_secret";
const secret = new TextEncoder().encode(secretWord);

async function createJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2min")
    .sign(secret);
}

//TODO: expiration time is 2min. Change it later.
export async function createSession(TeamId) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  const session = await createJWT({ TeamId, expiresAt });
  const c = await cookies();
  c.set("session", session, {
    httpOnly: true,
    expires: expiresAt,
    secure: true,
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
