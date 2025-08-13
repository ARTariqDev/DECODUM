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

export async function createSession(TeamId) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  const session = await createJWT({ TeamId, expiresAt });
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
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
  }
}
