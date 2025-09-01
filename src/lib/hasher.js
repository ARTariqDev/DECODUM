import bcrypt from "bcrypt";

const saltRounds = 10;

export function hashPassword(plainPass) {
  return bcrypt
    .hash(plainPass, saltRounds)
    .then((hash) => hash)
    .catch((err) => console.error("error: ", err));
}

export async function checkPass(plainPass, hash) {
  try {
    const result = await bcrypt.compare(plainPass, hash);
    return result;
  } catch (e) {
    console.log("Error in comparing password");
    console.error(err);
  }
}
