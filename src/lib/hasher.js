
// Plain-text password comparison (not secure)
export function hashPassword(plainPass) {
  return plainPass;
}

export async function checkPass(plainPass, storedPass) {
  return plainPass === storedPass;
}
