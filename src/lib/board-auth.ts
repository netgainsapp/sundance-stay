import { cookies } from "next/headers";
import { verifyBoardToken, BOARD_COOKIE_NAME } from "./board-session";
import { prisma } from "./prisma";

/** Returns the signed-in marketplace user id, or null. */
export async function currentBoardUserId(): Promise<string | null> {
  const store = await cookies();
  return verifyBoardToken(store.get(BOARD_COOKIE_NAME)?.value);
}

/** True when a user has been suspended by an admin. Fails open on DB error. */
export async function isBoardUserSuspended(userId: string): Promise<boolean> {
  try {
    const u = await prisma.boardUser.findUnique({
      where: { id: userId },
      select: { status: true },
    });
    return u?.status === "suspended";
  } catch {
    return false;
  }
}

/** Throws when no marketplace user is signed in. Use in server actions. */
export async function requireBoardUserId(): Promise<string> {
  const id = await currentBoardUserId();
  if (!id) throw new Error("Unauthorized");
  return id;
}
