import { cookies } from "next/headers";
import { verifyBoardToken, BOARD_COOKIE_NAME } from "./board-session";

/** Returns the signed-in marketplace user id, or null. */
export async function currentBoardUserId(): Promise<string | null> {
  const store = await cookies();
  return verifyBoardToken(store.get(BOARD_COOKIE_NAME)?.value);
}

/** Throws when no marketplace user is signed in. Use in server actions. */
export async function requireBoardUserId(): Promise<string> {
  const id = await currentBoardUserId();
  if (!id) throw new Error("Unauthorized");
  return id;
}
